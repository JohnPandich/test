package test

import test.User
import test.UserRole
import test.User
import grails.transaction.Transactional

@Transactional
class TestService {

    def init() {
		def adminRole = Role.findOrSaveWhere(authority: "admin");
		
		def adminUser = User.findWhere(username: "admin");
		
		// If the default user has not been defined, create it with admin authority
		if(adminUser == null){
			adminUser = new User(username: "admin", password: "password");
			adminUser.save(/*flush: true,*/ failOnError: true) // save new user to the database
			def userRole = new UserRole(user: adminUser, role: adminRole);
			userRole.save(/*flush: true,*/ failOnError: true)
		}
    }
}
