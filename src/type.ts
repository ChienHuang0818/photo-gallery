// src/types.ts
export interface Photo {
	id: string;
	urls: {
	  small: string;
	  full: string;
	};
	description: string;
	user: {
	  name: string;
	};
  }
  