/**
 * prisma/seed.js
 * Run: node prisma/seed.js
 * Seeds the PlanConfig table with FREE / BUSINESS / ENTERPRISE limits
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding plan configurations...');

  const plans = [
    {
      plan: 'FREE',
      displayName: 'Free',
      priceMonthly: 0,
      priceYearly: 0,
      maxMessages: 1000,
      maxAgents: 1,
      maxCampaigns: 2,
      maxContacts: 500,
      whatsappTemplates: 3,
      canUseAI: false,
      canUseCRM: false,
      canExportLeads: false,
      canUseAnalytics: false,
    },
    {
      plan: 'BUSINESS',
      displayName: 'Business',
      priceMonthly: 2999,   // ₹2,999/month
      priceYearly: 29990,   // ₹29,990/year (~2 months free)
      maxMessages: 50000,
      maxAgents: 10,
      maxCampaigns: 50,
      maxContacts: 25000,
      whatsappTemplates: 50,
      canUseAI: true,
      canUseCRM: true,
      canExportLeads: true,
      canUseAnalytics: true,
    },
    {
      plan: 'ENTERPRISE',
      displayName: 'Enterprise',
      priceMonthly: 9999,
      priceYearly: 99990,
      maxMessages: -1,       // unlimited
      maxAgents: -1,
      maxCampaigns: -1,
      maxContacts: -1,
      whatsappTemplates: -1,
      canUseAI: true,
      canUseCRM: true,
      canExportLeads: true,
      canUseAnalytics: true,
    },
  ];

  for (const plan of plans) {
    await prisma.planConfig.upsert({
      where: { plan: plan.plan },
      update: plan,
      create: plan,
    });
    console.log(`  ✅ ${plan.displayName} plan seeded`);
  }

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
