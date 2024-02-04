#! /usr/bin/env node

const { Command } = require("commander");
const fs = require("fs/promises");
const path = require("path");

const program = new Command();
const filePath = path.join(__dirname, "Expenses.json");

async function readFile(fPath) {
  const data = await fs.readFile(fPath, "utf-8");
  return data ? JSON.parse(data) : [];
}

program
  .command("create")
  .description("creates expenses")
  .argument("<total>", "total of expenses")
  .argument("<category>", "what kind of category")
  .action(async (total, category) => {
    try {
      const expenses = await readFile(filePath);
      const lastId = expenses[expenses.length - 1]?.id || 0;
      const date = new Date();
      expenses.push({ id: lastId + 1, total, category, date });
      fs.writeFile(filePath, JSON.stringify(expenses));
      console.log("expense created");
    } catch (e) {
      console.log("e", e);
    }
  });

program
.command("delete <id>")
.description("deleting expenses by id")
.action(async(id) => {
    try{
      const expenses = await readFile(filePath)
      const filteredExpenses = expenses.filter(expense => expense.id !== parseInt(id))
      if (filteredExpenses.length < expenses.length) {
        await fs.writeFile(filePath, JSON.stringify(filteredExpenses));
          console.log(`${id} deleted`);
        } else {
          console.log(`not found.`);
        }
    } catch (e) {
      console.log("e", e);
    }
});

program
.command("find <category>")
.description("find by category")
.action(async(category) => {
    try{
        const expenses = await readFile(filePath)
        const foundExpenses = expenses.filter(expense => expense.category === category)
        if(foundExpenses.length > 0){
            console.log(`category ${category} found`)
        } else {
            console.log('category not found')
        }
    } catch (e) {
        console.log("e", e)
    }
});



program.parse();