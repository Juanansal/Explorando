var paypal = require('paypal-rest-sdk');
var Ruta = require('../rutaEsquema');
var Usuario = require('../usuarioEsquema');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Acvw6_SmPX3PN_Ixmdg8niP066E6mp20jG-M5SgWKhL_tNYZbq8iRybhrJtYtO-6HpQw5_mYOxn1v3Fv',
  'client_secret': 'EBigu_1PuXUcEB2ewQkVkKptX0pciByPIzrXHHBF_hbXHjczAj3sViK0NBQP1txLHKSUBH1cCM7HBHPM'
});



module.exports = function(app)
{
	
	
	/*
		/paypal/realizarPago
		Envia la informacion para que paypal realice el pago
	
		Parametros -> _id
		Devuelve   -> json con todos los datos del usuario
	
		OK      -> Devuelve un json con datos y url sobre el pago creado
		ERROR 1 -> Error al acceder a la base de datos
		ERROR 2 -> Error al intentar realizar el pago
	*/
	app.get('/paypal/realizarPago', function(req, res){
        Ruta.findById(req.query._id, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar la ruta: '+req.query._id);
                res.send('1');
            }
			else
			{
				
				var create_payment_json = {
					"intent": "sale",
					"payer": {
						"payment_method": "paypal"
					},
					"redirect_urls": {
						"return_url": "http://localhost:5000/realizarReserva.html?id="+req.query._id+"?id=",
						"cancel_url": "http://localhost:5000/ruta.html?id="+req.query._id+"?id="
					},
					"transactions": [{
						"item_list": {
							"items": [{
								"name": resultado.titulo,
								"sku": resultado.titulo,
								"price": resultado.precio,
								"currency": "EUR",
								"quantity": 1
							}]
						},
						"amount": {
							"currency": "EUR",
							"total": resultado.precio
						},
						"description": resultado.descripcion
					}]
				};

				paypal.payment.create(create_payment_json, function (error, payment) {
					if (error) {
						res.send('2');
					} else {
						console.log("Create Payment Response");
						console.log(payment);
						res.send(payment);
					}
				});
				
				
				
				
				
                
            }
       });
    });
	
	
	
	/*
		/paypal/retirarSaldo
		Retira el saldo del usuario pasado por parametro
	
		Parametros -> usuario
		Devuelve   -> json con los datos de la peticion paypal realizada
	
		OK      -> Devuelve un json con los datos de paypal
		ERROR 1 -> Error al acceder a la base de datos
		ERROR 2 -> Error al intentar retirar el pago
	*/
	app.get('/paypal/retirarSaldo', function(req, res){
        Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar la ruta: '+req.query._id);
                res.send('1');
            }
			else
			{
				
				var sender_batch_id = Math.random().toString(36).substring(9);

				var create_payout_json = {
					"sender_batch_header": {
						"sender_batch_id": sender_batch_id,
						"email_subject": "You have a payment"
					},
					"items": [
						{
							"recipient_type": "EMAIL",
							"amount": {
								"value": 0.90,
								"currency": "USD"
							},
							"receiver": "shirt-supplier-three@mail.com",
							"note": "Thank you.",
							"sender_item_id": "item_3"
						}
					]
				};

				var sync_mode = 'true';

				paypal.payout.create(create_payout_json, sync_mode, function (error, payout) {
					if (error) {
						console.log(error.response);
						res.send('2')
					} else {
						console.log("Create Single Payout Response");
						console.log(payout);
						res.send(payout);
					}
				});
				
				
				
				
				
                
            }
       });
    });
	
	
	
	
	
	
	
	
	
	
	
}