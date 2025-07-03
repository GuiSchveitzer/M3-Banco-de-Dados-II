import express from 'express';
import cors from 'cors';
import { getEmployeesByManager } from './models/busca_employees_por_nome_manager.js';
import { getEmployeesByDepartment } from './models/busca_employees_por_departamento.js';
import { getAverageSalaryByDept } from './models/busca_media_departamento.js';

const app = express();
const port = 3000;

app.use(cors());

// 1. Employees por manager
// GET http://localhost:3000/employees-by-manager?manager=NomeDoManager
//http://localhost:3000/employees-by-manager?manager=Oscar%20Ghazalie
app.get('/employees-by-manager', async (req, res) => {
  const { manager } = req.query;
  if (!manager) return res.status(400).json({ error: 'Informe o nome do manager.' });
  try {
    const employees = await getEmployeesByManager(manager);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar funcionários por manager.' });
  }
});

// 2. Employees por departamento e data
// GET http://localhost:3000/employees-by-department?department=NomeDepto&from=YYYY-MM-DD&to=YYYY-MM-DD
// http://localhost:3000/employees-by-department?department=Development&from=1990-01-01&to=2000-12-31
app.get('/employees-by-department', async (req, res) => {
  const { department, from, to } = req.query;
  if (!department || !from || !to) {
    return res.status(400).json({ error: 'Informe department, from e to.' });
  }
  try {
    const employees = await getEmployeesByDepartment(department, from, to);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar funcionários por departamento.' });
  }
});

// 3. Média salarial por departamento
// GET http://localhost:3000/average-salary-by-department
// http://localhost:3000/average-salary-by-department
app.get('/average-salary-by-department', async (req, res) => {
  try {
    const avg = await getAverageSalaryByDept();
    res.json(avg);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar média salarial.' });
  }
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});