export namespace model {
	
	export class AppConfig {
	    openai_key: string;
	    whisper_model: string;
	    whisper_language: string;
	    download_dir: string;
	
	    static createFrom(source: any = {}) {
	        return new AppConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.openai_key = source["openai_key"];
	        this.whisper_model = source["whisper_model"];
	        this.whisper_language = source["whisper_language"];
	        this.download_dir = source["download_dir"];
	    }
	}
	export class TaskPo {
	    id: number;
	    task: string;
	    video_url: string;
	    task_status: string;
	    created_at: number;
	    updated_at: number;
	
	    static createFrom(source: any = {}) {
	        return new TaskPo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.task = source["task"];
	        this.video_url = source["video_url"];
	        this.task_status = source["task_status"];
	        this.created_at = source["created_at"];
	        this.updated_at = source["updated_at"];
	    }
	}

}

