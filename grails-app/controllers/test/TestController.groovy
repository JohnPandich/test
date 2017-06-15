package test

class TestController {

    def index() { }
	
	def test(){
		log.error("Got it");
		
		
		Thread.sleep(1000 * 60);
			
		log.error("Returning");
		
		response.status = 200;
		render "Got it";
	}
}
