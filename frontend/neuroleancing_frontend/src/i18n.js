const translations = {
    en: {
        // EditProfileModal
        'label.name': 'Name',
        'label.professionalTitle': 'Professional Title',
        'label.bio': 'Bio',
        'label.phoneNumber': 'Phone Number',
        'label.experience': 'Experience',
        'label.portfolioUrl': 'Portfolio URL',
        'label.companyName': 'Company Name',
        'label.projectInterests': 'Project Interests',
        'label.skills': 'Skills',
        'label.toolsKnown': 'Tools Known',
        // CreateProjectModal
        'label.projectTitle': 'Project Title',
        'label.description': 'Description',
        'label.budget': 'Budget',
        'label.deadline': 'Deadline',
        'label.skillsRequired': 'Skills Required',
        // SubmitProposalModal
        'label.bidAmount': 'Bid Amount ($)',
        'label.coverLetter': 'Cover Letter',
    }
};

const locale = 'en';

export const t = (key) => translations[locale]?.[key] ?? key;
