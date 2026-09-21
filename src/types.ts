export type ActiveTab = 'milyi' | 'indus' | 'friendship';

export interface ProfileData {
  id: 'milyi' | 'indus';
  tabTitle: string;
  subtitle: string;
  bio: string;
  tags: string[];
  photos: string[];
  accentColor: string;
}

export interface FriendshipState {
  startDate: string; // ISO string
  customDayOffset?: number;
}
