// Selecionando os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Selecionando os elementos da lista de despesas
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

// Inicia com foco no input de despesa
expense.focus()

// Selecionando o valor do input para formatação
amount.oninput = () => {
  // Pega o valor atual do input removendo os caracteres que não sejam númericos.
  let value = amount.value.replace(/\D/g, "")

  // Transformando o valor em centavos
  value = Number(value) / 100

  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // Formatando o valor para moeda BRL (Padrão brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })

  // Retornando o valor formatado no padrão esperado
  return value
}

// Captura o evento de submit do formulário para obter as informações
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página.
  event.preventDefault()

  // Cria um objeto com as informações da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(), 
  }

  // Execução da função que adiciona o item na lista
  expenseAdd(newExpense)

}

// Função que adiciona a nova despesa na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na lista (ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")
    
    // Cria o ícone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a informação da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adicionar o nome e categoria com as informações da categoria
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    // Cria o ícone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")  

    // Adiciona as informações do item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona o item na lista
    expenseList.append(expenseItem)
    // Limpa o formulário para adicionar um novo item 
    formClear()
    // Atualiza os totais
    updateTotals()

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas!")
    console.log(error)
  }
}

// Atualiza o total das despesas
function updateTotals() {
  try {
    // Recuperando todos os itens da lista
    const items = expenseList.children
    
    // Atualizando a quantidade de items da lista
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variável para incrementar o total.
    let total = 0

    // Percorre cada item da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")
      
      // Removendo os caracteres não númericos e susbtituindo a vírgula pelo o ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")
      
      // Convertendo o valor para o tipo float
      value = parseFloat(value)
      
      // Verificando se é um número válido
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total da despesa, verifique a digitação!")
      }

      // Incrementando o total
      total += Number(value)
    }

    // Criando a span com a formatação monetária
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formatando o valor e removendo o R$ que será exibido pela estilização
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpando o conteúdo do elemento
    expensesTotal.innerHTML = ""
    // Adicionando o símbolo monetário com o seu valor formatado
    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais das despesas!")
  }
}

// Capturando o evento do item da lista
expenseList.addEventListener("click", (event) => {
  // Verificando se o elemento clicado no evento
  if(event.target.classList.contains("remove-icon")) {
    // Obtém a li pai do elemento que recebeu o evento de clique
    const item = event.target.closest(".expense")
    // Remove o item da lista
    item.remove()
  }

  // Atualiza os totais das solicitações
  updateTotals()
})

// Limpando o formulário
function formClear() {
  // Limpando os inputs do formulário
  expense.value = ""
  category.value = ""
  amount.value = ""

  // Voltando o foco no input principal para o ínicio de um novo cadastro
  expense.focus()
}