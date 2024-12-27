export namespace config {
	
	export class AppConfig {
	    openai_key: string;
	    whisper_model: string;
	    whisper_language: string;
	
	    static createFrom(source: any = {}) {
	        return new AppConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.openai_key = source["openai_key"];
	        this.whisper_model = source["whisper_model"];
	        this.whisper_language = source["whisper_language"];
	    }
	}

}

