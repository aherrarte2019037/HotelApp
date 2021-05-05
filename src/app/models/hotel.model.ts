export interface Hotel {
    _id: string;
    likes: number;
    dislikes: number;
    rooms: Object[];
    reservations: Object[];
    name: string;
    stars: number;
    description: string;
    country: string;
    city: string;
    address: string;
    events: Object[];
}
