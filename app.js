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

  res.json(await getApi(await localizar(await getId(cidade, uf))));
});

app.listen(port, () => {
  console.log("Bem vindo ao Servidor! De o Post: /valid");
});

//Pega o Id da cidade
async function getId(cidade, uf) {
  CITY = cidade;
  UF = uf;

  const response = await axios.get(
    `http://apiadvisor.climatempo.com.br/api/v1/locale/city?name=${CITY}&state=${UF}&token=7f6e57a075a74d3bae6d433bbe65e19f`
  );
  IdCidade = response?.data?.[0]?.id;

  console.log(IdCidade);
  return IdCidade;
}

//Ve a Previsão do tempo
async function getApi(IdCidade) {
  let Id = IdCidade;

  const response = await axios.get(
    `http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${Id}/days/15?token=7f6e57a075a74d3bae6d433bbe65e19f`
  );
  return response.data;
}

//Localiza o Id da cidade em relção ao Token se não ele add
async function localizar(IdCidade) {
  const response = await axios.get(
    `http://apiadvisor.climatempo.com.br/api-manager/user-token/7f6e57a075a74d3bae6d433bbe65e19f/locales`
  );

  for (item of response.data.locales) {
    if (item === Number(IdCidade)) {
      return IdCidade;
    } else {
      console.log(
        "Use o Put: para adcionar a cidade, passando o Id da Cidade Que foi informado"
      );

      await axios.put(
        `http://apiadvisor.climatempo.com.br/api-manager/user-token/7f6e57a075a74d3bae6d433bbe65e19f/locales`,
        {
          localeId: IdCidade,
        }
      );
      return IdCidade;
    }
  }
}
