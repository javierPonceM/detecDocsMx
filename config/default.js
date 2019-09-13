let export_config = {};

export_config.app = {};
export_config.google = {};
export_config.db = {};
export_config.dirs = {};

export_config.app["timezone"] = "America/mexico_city";
export_config.app["port"] = 5013;
export_config.google['bucketName'] = 'deteccion-de-docs'; //nombre del contenedor google donde se cargaran archivos

export_config.db["url"] = process.env.urlDb || "localhost";
export_config.db["port"] = process.env.portDb || "5432";
export_config.db["user"] = process.env.userDb || "javier";
export_config.db["database"] = process.env.database || "infoFromDocsAnalizeDB";
export_config.db["password"] = process.env.passwordDb || "contrasenhaDb";

export_config.dirs["cropDir"] = process.cwd() + '/docs/cropImgs/';
export_config.dirs["receivedDir"] = process.cwd() + '/docs/docsReceived/';
export_config.dirs["jsonResultsDir"] = process.cwd() + '/docs/jsonResults/'
module.exports = export_config;


/*
gcloud config set account admin-253@gvisiondetectdocs.iam.gserviceaccount.com
gcloud config set project gvisiondetectdocs
gcloud auth activate-service-account --key-file="C:\Users\SOA\AppData\Local\Google\Cloud SDK\prueba-vision-234517-28e6401a3ee1.json"
gcloud auth activate-service-account admin-253@gvisiondetectdocs.iam.gserviceaccount.com --key-file="C:\Users\SOA\AppData\Local\Google\Cloud SDK\prueba-vision-234517-28e6401a3ee1.json"


*/
