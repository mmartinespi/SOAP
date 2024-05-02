const soap = require('soap');
const fs = require('fs');
const http = require('http');
const { isContext } = require('vm');
const postgres = require('postgres');

const sql = postgres({
    host: '172.20.10.6',
    port: 5432,
    db: "mydb",
    user: "user",
    password: "password",
});


const service = {
    ProductsService: {
        ProductsPort: {
            CreateProduct: async function ({ name, about, price }, callback) {
                console.log('create');
                if (!name || !about || !price) {
                    throw {
                        Fault: {
                            Code: {
                                Value: "soap:Sender",
                                Subcode: { value: "rpc:BadArguments" },
                            },
                            Reason: { Text: "Processing Error" },
                            statusCode: X,
                        },
                    };
                }
                try {
                    const product = await sql`
                        INSERT INTO products2 (name, about, price)
                        VALUES (${name}, ${about}, ${price})
                        RETURNING *
                    `;
                    console.log('here');
                    callback(product[0]);
                } catch (error) {
                    console.error(error);
                    callback(null);
                }
            },
            GetProducts: async function (args, callback) {
                console.log('get');
                const products = await sql`
                    SELECT * FROM products2
                `;
                callback(products);
            },
            PatchProduct: async function ({ id, name, about, price }, callback) {
                console.log('patch');
                const product = await sql`
                    UPDATE products2
                    SET name = ${name}, about = ${about}, price = ${price}
                    WHERE id = ${id}
                    RETURNING *
                `;
                callback(product[0]);
            },
            DeleteProduct : async function ({ id }, callback) {
                console.log('delete');
                const product = await sql`
                    DELETE FROM products2
                    WHERE id = ${id}
                    RETURNING *
                `;
                callback(product[0]);
            }
        },
    },
}

// http server example
const server = http.createServer(function (request, response) {
    response.end("404: Not Found: " + request.url);
})

server.listen(8000);

// Create the SOAP server
const xml = fs.readFileSync("productsService.wsdl", "utf8");
soap.listen(server, "/products", service, xml, function () {
    console.log("SOAP server running on http://localhost:8000/products?wsdl");
});