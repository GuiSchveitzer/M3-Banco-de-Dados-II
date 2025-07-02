import { connectToCassandra, closeCassandraConnection } from '../DBs/CassandraDB/CassandraDB.js';

export async function getAverageSalaryByDept() {
  const client = connectToCassandra();
  try {
    await client.connect();
    const query = `
      SELECT dept_no, dept_name, avg_salaries
      FROM avg_salary_by_dept
    `;
    const result = await client.execute(query, [], { prepare: true, fetchSize: 100000 });
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar média salarial por departamento:', error);
    throw error;
  } finally {
    await closeCassandraConnection(client);
  }
}

// Teste de execução direto via ES module
getAverageSalaryByDept()
  .then(departments => {
    console.table(departments);
    console.log(`Total de ${departments.length} departamento(s) com média salarial encontrados.`);
  })
  .catch(err => console.error('Erro:', err));
