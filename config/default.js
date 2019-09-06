let export_config = {};

export_config.app = {};
export_config.google = {};

export_config.app["timezone"] = "America/mexico_city";
export_config.app["port"] = 5013;
export_config.google['bucketName'] = 'deteccion-de-docs-soacmc'; //nombre del contenedor google donde se cargaran archivos


module.exports = export_config;


/*
gcloud config set account admin-253@gvisiondetectdocs.iam.gserviceaccount.com
gcloud config set project gvisiondetectdocs
gcloud auth activate-service-account --key-file="C:\Users\SOA\AppData\Local\Google\Cloud SDK\prueba-vision-234517-28e6401a3ee1.json"
gcloud auth activate-service-account admin-253@gvisiondetectdocs.iam.gserviceaccount.com --key-file="C:\Users\SOA\AppData\Local\Google\Cloud SDK\prueba-vision-234517-28e6401a3ee1.json"


*/
