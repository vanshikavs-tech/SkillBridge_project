const User = require('../models/User');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Contract = require('../models/Contract');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Payment = require('../models/Payment');

const { categoriesData, usersData, projectsData } = require('../dataset/seedDataset');

/**
 * Auto-Seed Service
 * 
 * Ensures the database is instantly populated with a rich dataset of clients,
 * expert freelancers, active projects, proposals, and contracts on server start.
 */

const seedAllData = async (clearExisting = false) => {
  if (clearExisting) {
    console.log('[Seeder] 🧹 Clearing collections for fresh seed...');
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Proposal.deleteMany({}),
      Contract.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Category.deleteMany({}),
      Review.deleteMany({}),
      Payment.deleteMany({}),
    ]);
  }

  console.log('[Seeder] 📁 Seeding Categories...');
  await Category.create(categoriesData);

  console.log('[Seeder] 👥 Seeding Users...');
  const userMap = {};
  for (const u of usersData) {
    const { key, ...userData } = u;
    const createdUser = await User.create(userData);
    userMap[key] = createdUser;
  }

  console.log('[Seeder] 📋 Seeding Projects...');
  const projectMap = {};
  for (const p of projectsData) {
    const { key, clientKey, hiredFreelancerKey, deadlineDays, ...pData } = p;
    const client = userMap[clientKey] || userMap['client_rahul'];
    const hired = hiredFreelancerKey ? userMap[hiredFreelancerKey] : null;

    const project = await Project.create({
      ...pData,
      clientId: client._id,
      deadline: new Date(Date.now() + (deadlineDays || 20) * 24 * 60 * 60 * 1000),
      hiredFreelancer: hired ? hired._id : null,
      proposalsCount: 0,
    });
    projectMap[key] = project;
  }

  console.log('[Seeder] 📝 Seeding Proposals...');
  const proj1 = projectMap['proj_saas_dashboard'];
  const proj2 = projectMap['proj_banking_figma'];
  const proj3 = projectMap['proj_ecommerce_store'];
  const proj4 = projectMap['proj_churn_ml'];
  const vanshika = userMap['freelancer_vanshika'];
  const ananya = userMap['freelancer_ananya'];
  const aarav = userMap['freelancer_aarav'];
  const priya = userMap['freelancer_priya'];

  // Proposal 1: Vanshika on SaaS Dashboard (ACCEPTED)
  const prop1 = await Proposal.create({
    projectId: proj1._id,
    freelancerId: vanshika._id,
    coverLetter: 'Hello Rahul! I have built several high-throughput MERN dashboards featuring WebSocket telemetry and Recharts. I can architect clean, modular components and deliver within your timeframe.',
    bidAmount: 48000,
    estimatedDays: 20,
    status: 'ACCEPTED',
  });
  await Project.findByIdAndUpdate(proj1._id, { $inc: { proposalsCount: 1 } });

  // Proposal 2: Ananya on Figma Banking (PENDING)
  await Proposal.create({
    projectId: proj2._id,
    freelancerId: ananya._id,
    coverLetter: 'Hi Rahul, I specialize in mobile banking and fintech UI systems. I have an extensive Figma UI library and can build an atomic design system for your banking app.',
    bidAmount: 32000,
    estimatedDays: 14,
    status: 'PENDING',
  });
  await Project.findByIdAndUpdate(proj2._id, { $inc: { proposalsCount: 1 } });

  // Proposal 3: Priya on E-commerce Store (PENDING)
  await Proposal.create({
    projectId: proj3._id,
    freelancerId: priya._id,
    coverLetter: 'Hello! I have extensive experience building Next.js 14 stores with Tailwind and Stripe checkout sessions. I can deliver a responsive, performant storefront in under 18 days.',
    bidAmount: 42000,
    estimatedDays: 18,
    status: 'PENDING',
  });
  await Project.findByIdAndUpdate(proj3._id, { $inc: { proposalsCount: 1 } });

  // Proposal 4: Aarav on Churn Model (PENDING)
  await Proposal.create({
    projectId: proj4._id,
    freelancerId: aarav._id,
    coverLetter: 'Hello Sarah! I have deployed several customer retention pipelines with XGBoost and FastAPI. I can ensure high recall and provide containerized microservices.',
    bidAmount: 58000,
    estimatedDays: 25,
    status: 'PENDING',
  });
  await Project.findByIdAndUpdate(proj4._id, { $inc: { proposalsCount: 1 } });

  console.log('[Seeder] 🤝 Seeding Contract & Milestones...');
  const clientRahul = userMap['client_rahul'];
  const contract = await Contract.create({
    projectId: proj1._id,
    clientId: clientRahul._id,
    freelancerId: vanshika._id,
    proposalId: prop1._id,
    amount: 48000,
    totalPaid: 15000,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'ACTIVE',
    milestones: [
      {
        title: 'Milestone 1: Wireframes & Database Models',
        description: 'Design mockups and initial MongoDB database schema setup.',
        amount: 15000,
        status: 'PAID',
      },
      {
        title: 'Milestone 2: API Integration & Real-time Charts',
        description: 'Express controllers, Recharts integration, and Socket.IO events.',
        amount: 20000,
        status: 'IN_PROGRESS',
      },
      {
        title: 'Milestone 3: Testing, Polishing & Handover',
        description: 'End-to-end testing, responsive polish, and deployment documentation.',
        amount: 13000,
        status: 'PENDING',
      },
    ],
  });

  console.log('[Seeder] 💳 Seeding Payment Transactions...');
  await Payment.create({
    contractId: contract._id,
    milestoneId: contract.milestones[0]._id,
    payerId: clientRahul._id,
    payeeId: vanshika._id,
    amount: 15000,
    currency: 'INR',
    paymentMethod: 'STRIPE',
    stripePaymentIntentId: 'pi_test_3P9seed0001',
    status: 'SUCCEEDED',
    description: 'Milestone 1 payment released',
  });

  console.log('[Seeder] ⭐ Seeding Reviews...');
  await Review.create({
    contractId: contract._id,
    reviewerId: clientRahul._id,
    revieweeId: vanshika._id,
    rating: 5,
    comment: 'Vanshika delivered top-tier architectural code ahead of schedule. Outstanding communication, clean components, and engineering precision!',
  });

  console.log('[Seeder] 💬 Seeding Conversations & Messages...');
  const conversation = await Conversation.create({
    participants: [clientRahul._id, vanshika._id],
    projectId: proj1._id,
    lastMessage: 'Milestone 2 integration is underway!',
    lastMessageSender: vanshika._id,
    lastMessageAt: new Date(),
  });

  await Message.create([
    {
      conversationId: conversation._id,
      senderId: clientRahul._id,
      receiverId: vanshika._id,
      message: 'Hi Vanshika! Congratulations, your bid on the SaaS Dashboard was accepted.',
    },
    {
      conversationId: conversation._id,
      senderId: vanshika._id,
      receiverId: clientRahul._id,
      message: 'Thank you Rahul! Milestone 1 architecture has been deployed and approved.',
    },
    {
      conversationId: conversation._id,
      senderId: vanshika._id,
      receiverId: clientRahul._id,
      message: 'Milestone 2 integration is underway!',
    },
  ]);

  console.log('[Seeder] ✅ Full marketplace dataset successfully seeded!');
};

/**
 * Checks if database has projects, if not, seeds automatically on boot
 */
const runAutoSeedIfEmpty = async () => {
  try {
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('[AutoSeed] ℹ️ Database is empty. Auto-seeding full marketplace dataset...');
      await seedAllData(false);
      console.log('[AutoSeed] 🚀 Auto-seed finished! Platform is ready with live projects & talent.');
    } else {
      console.log(`[AutoSeed] ℹ️ Database already populated (${projectCount} projects found).`);
    }
  } catch (err) {
    console.warn('[AutoSeed] Warning during auto-seed check:', err.message);
  }
};

module.exports = {
  seedAllData,
  runAutoSeedIfEmpty,
};
