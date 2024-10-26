interface Challenge {
    challengeId: string;
    title: string;
    description: string;
}

interface MemeData {
    selectedImage: string;
    caption: string;
    challengeId: string;
    createdAt: string;
    createdBy: string;
    ratings: {
        totalRating: number; // Total score from all ratings
        count: number; // Number of ratings
    };
}

