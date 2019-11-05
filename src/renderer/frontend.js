const { setIpc, openDirectory, selectROMNormal, selectROMPlus } = require('./ipcRendererEvents')

window.addEventListener('load', () => {
  setIpc()
  examinar()
  seleccionarNormal()
  seleccionarPlus()
})

function examinar(){
  const $btnExaminar = document.getElementById('btnExaminar')
  $btnExaminar.addEventListener('click', openDirectory)
}

function seleccionarNormal(){
  const $btnNormal = document.getElementById('btnNormal')
  $btnNormal.addEventListener('click', selectROMNormal)
}

function seleccionarPlus(){
  const $btnPlus = document.getElementById('btnPlus')
  $btnPlus.addEventListener('click', selectROMPlus)
}