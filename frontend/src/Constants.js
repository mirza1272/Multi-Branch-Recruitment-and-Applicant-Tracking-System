export const STATUSES = [
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Hired",
    "Rejected"
];

export const CATEGORIES = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Finance",
    "Operations",
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
