const { default: axios } = require("axios");
const exepress = require("express");
const app = exepress();
const port = 8000;
var IdCidade;
var CITY;
var UF;

//5959

app.use(exepress.json());

app.get("/:cidade/:uf", function (req, res) {
  const { cidade, uf } = req.params;

  res.json({ cidade, uf });
});

/*app.get("/valid", function (req, res) {
  const { cidade, uf } = req.query;

  CITY = res.json({ cidade,uf });
  
});*/

app.post("/valid", async function (req, res) {
  const { cidade, uf } = req.body;

  res.json(await getApi(await getId(cidade, uf)));
});

app.listen(port, () => {
  console.log("Bem vindo ao Servidor! De o Post: /valid");
});

async function getId(cidade, uf) {
  CITY = cidade;
  UF = uf;
  const response = await axios.get(
    `http://apiadvisor.climatempo.com.br/api/v1/locale/city?name=${CITY}&state=${UF}&token=7f6e57a075a74d3bae6d433bbe65e19f`
  );
  IdCidade = response?.data?.[0]?.id;
  console.log(IdCidade);
  //console.log("De um Put no IdCidade!!!");
  //localizar(IdCidade);
  return IdCidade;
}

async function getApi(IdCidade) {
  let Id = IdCidade;
  const response = await axios.get(
    `http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${Id}/days/15?token=7f6e57a075a74d3bae6d433bbe65e19f`
  );
  console.log(response.data);
}

async function localizar(IdCidade) {
  let Idlocalizar = IdCidade;
  //let i;
  const response = await axios.get(
    `http://apiadvisor.climatempo.com.br/api-manager/user-token/7f6e57a075a74d3bae6d433bbe65e19f/locales`
  );
  if (response.data.find((element) => element.locales == Idlocalizar)) {
    console.log("Achou");
  }
}
