const featured = {
    fee: 100,
    description: 'Get more visibility and applications'
};

const urgent = {
    fee: 50,
    description: 'Show urgency badge to attract faster responses'
};

const platformFee = {
    percentage: 5,
    description: '5% platform fee on successful project completion'
};

const calculateProjectFees = (projectData) => {
    let fees = {
        baseFee: 0,
        featuredFee: 0,
        urgentFee: 0,
        platformFee: 0,
        total: 0
    };

    // Add featured project fee if selected
    if (projectData.isFeatured) {
        fees.featuredFee = featured.fee;
    }

    // Add urgent project fee if selected
    if (projectData.isUrgent) {
        fees.urgentFee = urgent.fee;
    }

    // Calculate platform fee (applied on project budget)
    fees.platformFee = (projectData.budget * platformFee.percentage) / 100;

    // Calculate total
    fees.total = fees.baseFee + fees.featuredFee + fees.urgentFee + fees.platformFee;

    return fees;
};

module.exports = {
    featured,
    urgent,
    platformFee,
    calculateProjectFees
};