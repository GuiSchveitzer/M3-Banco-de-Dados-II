import { connectToCassandra, closeCassandraConnection } from '../DBs/CassandraDB/CassandraDB.js';
import { types } from 'cassandra-driver';

export async function getEmployeesByDepartment(deptName, fromDate, toDate) {
  const client = connectToCassandra();
  try {
    await client.connect();
    const query = `
      SELECT emp_no, birth_date, first_name, last_name, gender, hire_date, dept_no, dept_name, from_date, to_date
      FROM employees_by_dept
      WHERE dept_name = ? AND from_date >= ? AND to_date <= ?
      ALLOW FILTERING
    `;
    const result = await client.execute(query, [deptName, fromDate, toDate], { prepare: true, fetchSize: 100000 });
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar funcionários por departamento:', error);
    throw error;
  } finally {
    await closeCassandraConnection(client);
  }
}

// Teste de execução direto via ES module
const nomeDepartamento = 'Development'; // Troque pelo nome do departamento desejado
const dataInicio = '1990-01-01'; // Data de início
const dataFim = '2000-12-31'; // Data de fim
getEmployeesByDepartment(nomeDepartamento, dataInicio, dataFim)
  .then(employees => {
    // Converte datas LocalDate para string legível
    employees.forEach(emp => {
      if (emp.birth_date instanceof types.LocalDate) emp.birth_date = emp.birth_date.toString();
      if (emp.hire_date instanceof types.LocalDate) emp.hire_date = emp.hire_date.toString();
      if (emp.from_date instanceof types.LocalDate) emp.from_date = emp.from_date.toString();
      if (emp.to_date instanceof types.LocalDate) emp.to_date = emp.to_date.toString();
    });
    console.table(employees);
    console.log(`O departamento: ${nomeDepartamento}, no período de ${dataInicio} a ${dataFim}, tem ${employees.length} funcionário(s) relacionados a ele.`);
  })
  .catch(err => console.error('Erro:', err));
