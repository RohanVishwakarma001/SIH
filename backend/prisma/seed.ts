import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seeds only operational reference/configuration data — no demo patients,
 * clinical records, or staff accounts. This is safe to run against a
 * production database.
 *
 * To create your first real login, use the one-time admin bootstrap
 * endpoint (see docs/deployment.md) rather than a seeded account.
 */
async function main() {
  console.log('🌱 Seeding MediKiosk reference/configuration data...');

  const hospital = await prisma.hospital.upsert({
    where: { code: 'AIIMS_DELHI' },
    update: {},
    create: {
      name: 'All India Institute of Medical Sciences (AIIMS)',
      code: 'AIIMS_DELHI',
      city: 'New Delhi',
      state: 'Delhi',
    },
  });

  const generalDept = await prisma.department.upsert({
    where: { code: 'general' },
    update: {},
    create: {
      code: 'general',
      name: 'General Medicine',
      nativeName: 'सामान्य चिकित्सा',
      description: 'Fever, cough, weakness, common infections, diabetes & BP checkup',
      icon: 'Stethoscope',
      avgWaitMins: 14,
      hospitalId: hospital.id,
    },
  });

  await prisma.department.upsert({
    where: { code: 'cardiology' },
    update: {},
    create: {
      code: 'cardiology',
      name: 'Cardiology',
      nativeName: 'हृदय रोग विभाग',
      description: 'Chest discomfort, high BP, palpitations, breathlessness, cardiac review',
      icon: 'HeartPulse',
      avgWaitMins: 18,
      hospitalId: hospital.id,
    },
  });

  await prisma.department.upsert({
    where: { code: 'ayush' },
    update: {},
    create: {
      code: 'ayush',
      name: 'AYUSH / Ayurveda',
      nativeName: 'आयुष एवं आयुर्वेद',
      description: 'Holistic assessment, Dashavidha Pariksha, chronic metabolic & lifestyle care',
      icon: 'Leaf',
      avgWaitMins: 10,
      hospitalId: hospital.id,
    },
  });

  await prisma.department.upsert({
    where: { code: 'orthopedics' },
    update: {},
    create: {
      code: 'orthopedics',
      name: 'Orthopedics',
      nativeName: 'हड्डी एवं जोड़ रोग',
      description: 'Joint pain, fractures, spine problems, arthritis, difficulty walking',
      icon: 'Bone',
      avgWaitMins: 12,
      hospitalId: hospital.id,
    },
  });

  // Kiosk terminals start idle/ready — no fictional in-progress patient tokens.
  await prisma.kioskTerminal.upsert({
    where: { terminalCode: 'K01' },
    update: {},
    create: {
      terminalCode: 'K01',
      location: 'Gate 2 OPD Triage',
      status: 'Ready',
      activeLanguage: 'hi',
      hospitalId: hospital.id,
    },
  });

  await prisma.kioskTerminal.upsert({
    where: { terminalCode: 'K02' },
    update: {},
    create: {
      terminalCode: 'K02',
      location: 'Main OPD Lobby',
      status: 'Ready',
      activeLanguage: 'hi',
      hospitalId: hospital.id,
    },
  });

  await prisma.kioskTerminal.upsert({
    where: { terminalCode: 'K03' },
    update: {},
    create: {
      terminalCode: 'K03',
      location: 'AYUSH Wing 1st Floor',
      status: 'Ready',
      activeLanguage: 'en',
      hospitalId: hospital.id,
    },
  });

  await prisma.kioskTerminal.upsert({
    where: { terminalCode: 'K04' },
    update: {},
    create: {
      terminalCode: 'K04',
      location: 'Gate 3 Ortho Block',
      status: 'Ready',
      activeLanguage: 'mr',
      hospitalId: hospital.id,
    },
  });

  console.log('✅ Seeded hospital, departments, and kiosk terminals. No demo accounts or patients were created.');
  console.log(`   General department id (default for walk-in/ABHA check-in): ${generalDept.id}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
