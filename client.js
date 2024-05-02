const soap = require('soap');

const callback = (err, result) => {
    if (err) {
        console.error (
            "Error making SOAP request:",
            err.response.status,
            err.response.statusText,
            err.body
        );
        return;
    }
    console.log("Result: ", result);
};

soap.createClient('http://localhost:8000/products?wsdl', {}, function (err, client) {
    if (err) {
        console.log("Error creating SOAP client: ", err);
        return;
    }
    // client.CreateProduct({ name: 'testing', about: 'testing', price: 100}, callback);
    client.GetProducts(null, callback);
    //client.PatchProduct({ id: 2, name: 'bonjour', about: 'bonjour', price: 500}, callback);
    client.DeleteProduct({ id: 2 }, callback);
});
