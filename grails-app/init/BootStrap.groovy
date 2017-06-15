class BootStrap {

	def testService
	
    def init = { servletContext ->
		testService.init();
    }
    def destroy = {
    }
}
