const fetch = require("node-fetch");
const FormData = require("form-data");

const FIPE_HOST = "https://veiculos.fipe.org.br/api/veiculos";

const consultaMarcas = `${FIPE_HOST}/ConsultarMarcas`;
const consultaModelos = `${FIPE_HOST}/ConsultarModelos`;
const consultaAnoModelo = `${FIPE_HOST}/ConsultarAnoModelo`;
const consultaModelosAtravesDoAno = `${FIPE_HOST}/ConsultarModelosAtravesDoAno`;
const consultaValor = `${FIPE_HOST}/ConsultarValorComTodosParametros`;

const rand = (from, to) => Math.floor(Math.random() * to) + from;
const randFrom = arr => arr[rand(0, arr.length - 1)];

const formData = obj =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join("&");

const sendFipeForm = (url, body = {}) =>
  fetch(url, {
    method: "POST",
    headers: {
      Host: "veiculos.fipe.org.br",
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "https://veiculos.fipe.org.br",
      Referer: "https://veiculos.fipe.org.br/"
    },
    body: formData(body)
  }).then(res => res.json());

const vehicleType = {
  carro: 1,
  moto: 2,
  caminhoes: 3
};

const main = async () => {
  let codigoTipoVeiculo = vehicleType.carro;
  let codigoTabelaReferencia = 251; //  mes/ano  | 251 -> 02/2020
  let codigoMarca = null;
  let codigoModelo = null;
  let anoModelo = null;
  let codigoTipoCombustivel = null;

  console.log(`Procurando por marcas de carros na Tabela FIPE`);
  const marcas = await sendFipeForm(consultaMarcas, {
    codigoTipoVeiculo,
    codigoTabelaReferencia
  });

  const marcaSel = randFrom(marcas);
  console.log(`Selecionado a marca ${marcaSel.Label}`);
  codigoMarca = marcaSel.Value;

  console.log(`Procurando por modelos da marca ${marcaSel.Label}`);
  const { Modelos: modelos } = await sendFipeForm(consultaModelos, {
    codigoTipoVeiculo,
    codigoTabelaReferencia,
    codigoMarca
  });

  const modeloSel = randFrom(modelos);
  console.log(`Selecionado o modelo ${modeloSel.Label}`);
  codigoModelo = modeloSel.Value;

  console.log(`Procurando por ano modelo do modelo ${modeloSel.Label}`);
  const anosModelos = await sendFipeForm(consultaAnoModelo, {
    codigoTipoVeiculo,
    codigoTabelaReferencia,
    codigoMarca,
    codigoModelo
  });

  const anoModeloSel = randFrom(anosModelos);
  console.log(`Selecionado o ano modelo ${anoModeloSel.Label}`);
  anoModelo = anoModeloSel.Value.split("-")[0];
  codigoTipoCombustivel = anoModeloSel.Value.split("-")[1];

  console.log(`Procurando resultados`);
  const valor = await sendFipeForm(consultaValor, {
    codigoTipoVeiculo,
    codigoTabelaReferencia,
    codigoMarca,
    codigoModelo,
    anoModelo,
    codigoTipoCombustivel,
    tipoConsulta: "tradicional"
  });

  console.log(valor);
};

main();
