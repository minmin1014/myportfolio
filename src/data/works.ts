export type WorkId = "award" | "expo-pr" | "youtube" | "attendance-system";

export type WorkEntry = {
  id: WorkId;
  image: string;
  link?: string;
};

export const works: WorkEntry[] = [
  {
    id: "award",
    image: "/images/works/award-v2.jpg",
  },
  {
    id: "expo-pr",
    image: "/images/works/expo-pr-v2.jpg",
    link: "https://x.com/glee_kwansei/status/1969317060665585946?s=46",
  },
  {
    id: "youtube",
    image: "/images/works/youtube.jpg",
    link: "https://www.youtube.com/@KwanseiGakuin_GleeClub",
  },
  {
    id: "attendance-system",
    image: "/images/works/attendance-system-v2.jpg",
    link: "/demo/attendance-system",
  },
];
