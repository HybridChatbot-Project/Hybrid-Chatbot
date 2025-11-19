export interface MedicResourceTable {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface ApiNewsResponseGeneral {
  status: string;
  totalResults: number;
  results: ApiNewsResponseArticle[];
  nextPage: string;
}

export interface ApiNewsResponseArticle {
  article_id: string;
  title: string;
  description: string;
  link: string;
  image_url: string;
}
