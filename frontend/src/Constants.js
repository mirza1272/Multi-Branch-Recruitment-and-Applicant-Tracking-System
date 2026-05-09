export const STATUSES = [
    "pending",
    "shortlisted",
    "interview scheduled",
    "rejected",
    "accepted"
];

export const CATEGORIES = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Finance",
    "Operations",
    "Design",
    "Customer Support",
    "Product",
    "Quality Assurance",
    "Healthcare",
    "Other"
];

export const INITIAL_BRANCHES = [
    "New York",
    "Los Angeles",
    "Texas",
    "London",
    "Tokyo",
    "Berlin"
];

export const getDynamicBranches = () => {
    const custom = JSON.parse(localStorage.getItem('custom_branches')) || [];
    // Remove duplicates and combine
    const all = [...new Set([...INITIAL_BRANCHES, ...custom])];
    return all;
};

export const addBranch = (name) => {
    const custom = JSON.parse(localStorage.getItem('custom_branches')) || [];
    if (!custom.includes(name) && !INITIAL_BRANCHES.includes(name)) {
        custom.push(name);
        localStorage.setItem('custom_branches', JSON.stringify(custom));
        return true;
    }
    return false;
};
