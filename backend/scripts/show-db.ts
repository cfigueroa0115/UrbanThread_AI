import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get all tables
  const tables = await prisma.$queryRaw<Array<{table_name: string; columns: bigint}>>`
    SELECT table_name, 
      (SELECT count(*) FROM information_schema.columns c 
       WHERE c.table_name = t.table_name AND c.table_schema = 'public') as columns 
    FROM information_schema.tables t 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE' 
    ORDER BY table_name`;

  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║     BASE DE DATOS: urbanthread_ai                   ║');
  console.log('║     PostgreSQL 18 - Embedded                        ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`\n  Total tablas: ${tables.length}\n`);
  console.log('  ' + 'TABLA'.padEnd(28) + 'COLUMNAS');
  console.log('  ' + '-'.repeat(38));
  for (const t of tables) {
    console.log('  ' + t.table_name.padEnd(28) + String(t.columns));
  }

  // Record counts
  console.log('\n  ' + 'TABLA'.padEnd(28) + 'REGISTROS');
  console.log('  ' + '-'.repeat(38));
  
  const tableNames = tables.map(t => t.table_name);
  for (const name of tableNames) {
    try {
      const result = await prisma.$queryRawUnsafe<Array<{c: number}>>(`SELECT count(*)::int as c FROM "${name}"`);
      console.log('  ' + name.padEnd(28) + result[0]!.c);
    } catch {
      console.log('  ' + name.padEnd(28) + 'ERROR');
    }
  }

  // Show relationships (foreign keys)
  const fks = await prisma.$queryRaw<Array<{constraint_name: string; table_name: string; column_name: string; foreign_table: string; foreign_column: string}>>`
    SELECT 
      tc.constraint_name,
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table,
      ccu.column_name AS foreign_column
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    ORDER BY tc.table_name, kcu.column_name`;

  console.log(`\n  RELACIONES (Foreign Keys): ${fks.length}`);
  console.log('  ' + '-'.repeat(60));
  for (const fk of fks) {
    console.log(`  ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table}.${fk.foreign_column}`);
  }

  // Show indexes
  const indexes = await prisma.$queryRaw<Array<{tablename: string; indexname: string}>>`
    SELECT tablename, indexname FROM pg_indexes 
    WHERE schemaname = 'public' 
    ORDER BY tablename, indexname`;

  console.log(`\n  INDICES: ${indexes.length}`);
  console.log('  ' + '-'.repeat(60));
  for (const idx of indexes) {
    console.log(`  ${idx.tablename}: ${idx.indexname}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
