export interface Image {
  id: string;
  urls: {
    regular: string;
  };
  user: {
    first_name: string;
  }
  alt_description: string;
  loaded: boolean;
}
