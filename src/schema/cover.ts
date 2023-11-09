import { Metadata } from "./metadata";
import { Section } from "./section";

export type Cover = {
    id: number;
    shortId: string;
    name: string;
    slug: string;
    image: string;
    sections: Record<string, Section>;
    metadata: Metadata;
    public: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    userid: string,
  }
  