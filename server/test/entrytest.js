/* eslint-disable one-var */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

import helper from '../middlewares/helpers';

chai.use(chaiHttp);
chai.should();

describe('Entry creation', () => {
	
	describe('entries', () => {
		let token;
		let token2;
		let ownerId;
		let invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJODg4OTk5OUB'
		const unExistedToken = helper.getToken({id:0, firstName:"amani", lastName:"murera", email:"amani@gmail.com"});
		let propertyId;
		it('user should create a user account', (done) => {
			const data = {
				firstName: 'Nyagatare',
				lastName: 'James',
				email: 'nyatare@gmail.com',
				password: 'Aa!12345'
			};
			chai.request(app)
				.post('/api/v2/auth/signup')
				.send(data)
				.end((err, res) => {
					ownerId = res.body.data.id;
					token = res.body.data.token;
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					res.body.should.have.property('data');
					res.body.data.should.have.property('firstname').eql('Nyagatare');
					res.body.data.should.have.property('lastname').eql('James');
					res.body.data.should.be.a('object');
					res.body.data.should.not.have.property('password');
					res.body.data.should.have.property('id');
					res.body.data.should.have.property('createdon');
					
					done();
				});
		});
		it('user should create a user account', (done) => {
			const data = {
				firstName: 'Nyagatare',
				lastName: 'James',
				email: 'kigali@gmail.com',
				password: 'Aa!123454'
			};
			chai.request(app)
				.post('/api/v2/auth/signup')
				.send(data)
				.end((err, res) => {
					ownerId = res.body.data.id;
					token2 = res.body.data.token;
					res.should.have.status(201);
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					res.body.should.have.property('data');
					res.body.data.should.have.property('firstname').eql('Nyagatare');
					res.body.data.should.have.property('lastname').eql('James');
					res.body.data.should.be.a('object');
					res.body.data.should.not.have.property('password');
					res.body.data.should.have.property('id');
					res.body.data.should.have.property('createdon');
					
					done();
				});
		});

		it('it should create an entry', (done) => {
			const data = {
				title: 'a brand new entry',
				description: 'my firt entry',
				
			};
			chai.request(app)
				.post('/api/v2/entries')
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.end((err, res) => {
					res.should.have.status(201);
                    res.body.should.have.property('status').eql(201);
                    res.body.should.have.property('message').eql('entry successfully created');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('title').eql('a brand new entry');
                    res.body.data.should.have.property('description').eql('my firt entry');
                    res.body.data.should.have.property('id');
                    res.body.data.should.have.property('ownerid');
                    res.body.data.should.have.property('createdon');
					done();
				});
		});
		it('it should not create an entry if title is empty', (done) => {
			const data = {
				
				description: 'my firt entry'
				
			};
			chai.request(app)
				.post('/api/v2/entries')
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status');
					res.body.should.have.property('data');
					res.body.data.should.be.a('object');
                    res.body.data.should.have.property('error');
                    done();
				});
		});
		it('it should not create an entry if description is empty', (done) => {
			const data = {
				title: 'a brand new entry'
				
				
			};
			chai.request(app)
				.post('/api/v2/entries')
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status');
					res.body.should.have.property('data');
					res.body.data.should.be.a('object');
                    res.body.should.have.property('status').eql(400);
                    res.body.data.should.have.property('error');
					done();
				});
		});
		it('it should not create an entry if description and title are not providen', (done) => {
			const data = {
				
				
				
			};
			chai.request(app)
				.post('/api/v2/entries')
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status');
					res.body.should.have.property('data');
					res.body.data.should.be.a('object');
                    res.body.should.have.property('status').eql(400);
                    res.body.data.should.have.property('error');
					done();
				});
        });
        it('it should not create an entry if description and title are empty', (done) => {
			const data = {
				title: '',
				description: '',
				
			};
			chai.request(app)
				.post('/api/v2/entries')
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status');
					res.body.should.have.property('data');
					res.body.data.should.be.a('object');
                    res.body.should.have.property('status').eql(400);
                    res.body.data.should.have.property('error');
					done();
				});
        });
        it('it should not create an entry if token is not providen', (done) => {
			const data = {
				title: 'a brand new entry',
				description: 'my firt entry',
				
			};
			chai.request(app)
				.post('/api/v2/entries')
				.set('Authorization', '')
				.send(data)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status');
                    res.body.should.have.property('status').eql(400);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('No token found');
					done();
				});
        });
        it('it should not create an entry if token is invalid', (done) => {
			const data = {
				title: 'a brand new entry',
				description: 'my firt entry',
				
			};
			chai.request(app)
				.post('/api/v2/entries')
				.set('Authorization', `Bearer ${invalidToken}`)
				.send(data)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property('name');
                    res.body.should.have.property('message');
                    
					done();
				});
        });
        it('it should not create an entry if user does not exist', (done) => {
			const data = {
				title: 'a brand new entry',
				description: 'my firt entry',
				
			};
			chai.request(app)
				.post('/api/v2/entries')
				.set('Authorization', `Bearer ${unExistedToken}`)
				.send(data)
				.end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status');
					res.body.should.have.property('status').eql(401);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('Invalid Token');
					done();
				});
        });
        
		//user edit delete and update his entries
		describe('user can alter his entries', () => {
			before('create an entry', (done) => {
				const data = {
					title: 'visiting friend',
					
					description: 'it was a long time',
					
				};
				chai.request(app)
					.post('/api/v2/entries')
					.set('Authorization', `Bearer ${token}`)
					.send(data)
					.end((err, res) => {
						propertyId = res.body.data.id;
						res.should.have.status(201);
						res.body.should.have.property('status').eql(201);
						done();
					});
			});
            it('it should not create two entries of the same name', (done) => {
                const data = {
                    title: 'a brand new entry',
                    description: 'my firt entry',
                    
                };
                chai.request(app)
                    .post('/api/v2/entries')
                    .set('Authorization', `Bearer ${token}`)
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.have.property('status');
                        res.body.should.have.property('data');
                        res.body.data.should.be.a('object');
                        res.body.should.have.property('status').eql(409);
                        res.body.data.should.have.property('error');
                        res.body.data.should.have.property('error').eql('entry already exist');
                        done();
                    });
            });
			it('user can edit an entry', (done) => {
				const data = {
					title: 'an edited title',
					
					description: 'edited description',
					
				};
				chai.request(app)
					.patch(`/api/v2/entries/${propertyId}`)
					.set('Authorization', `Bearer ${token}`)
					.send(data)
					.end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status').eql(200);
                        res.body.should.have.property('data');
                        res.body.data.should.be.a('object');
						res.body.data.should.have.property('description').eql('edited description');
						res.body.data.should.have.property('title').eql('an edited title');
                        res.body.should.have.property('message').eql('entry successfully edited');
                        res.body.data.should.have.property('id');
                        res.body.data.should.have.property('ownerid');
                        res.body.data.should.have.property('createdon');
						done();
					});
			});


			it('user can not delete a non existing entry', (done) => {
				chai.request(app)
					.delete('/api/v2/entries/0')
					.set('Authorization', `Bearer ${token}`)
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.have.property('data');
						res.body.data.should.be.a('object');
						res.body.data.should.have.property('error').eql('entry Not found');
						res.body.should.have.property('status').eql(404);
						done();
					});
			});
			it('user can not delete an entry which he does not own ', (done) => {
				chai.request(app)
				.delete(`/api/v2/entries/${propertyId}`)
				.set('Authorization', `Bearer ${token2}`)
					.end((err, res) => {
						res.should.have.status(403);
						res.body.should.have.property('data');
						res.body.data.should.be.a('object');
						res.body.data.should.have.property('error').eql('forbidden');
						res.body.should.have.property('status').eql(403);
						done();
					});
			});
			it('user can not update an entry which he does not own ', (done) => {
				chai.request(app)
				.patch(`/api/v2/entries/${propertyId}`)
				.set('Authorization', `Bearer ${token2}`)
					.end((err, res) => {
						res.should.have.status(403);
						res.body.should.have.property('data');
						res.body.data.should.be.a('object');
						res.body.data.should.have.property('error').eql('forbidden');
						res.body.should.have.property('status').eql(403);
						done();
					});
			});

			it('user can not update a non existing property', (done) => {
				chai.request(app)
					.patch('/api/v2/entries/0')
					.set('Authorization', `Bearer ${token}`)
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.have.property('data');
						res.body.data.should.be.a('object');
						res.body.data.should.have.property('error').eql('entry Not found');
						res.body.should.have.property('status').eql(404);
						done();
					});
			});
			it('user can get all entries ', (done) => {
				chai.request(app)
					.get('/api/v2/entries')
					.set('Authorization', `Bearer ${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.have.property('data');
						res.body.data.should.be.a('array');
						
						done();
					});
			});
			it('user can not get entry if his dairy is empty ', (done) => {
				chai.request(app)
					.get('/api/v2/entries')
					.set('Authorization', `Bearer ${token2}`)
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.have.property('data');
						res.body.data.should.be.a('object');
						res.body.data.should.have.property('error').eql('you do not have any entries now');
						done();
					});
            });
            it('user can not get all entry if he does not provide a token ', (done) => {
				chai.request(app)
					.get('/api/v2/entries')
					.set('Authorization', '')
					.end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('status');
                        res.body.should.have.property('status').eql(400);
                        res.body.should.have.property('error');
                        res.body.should.have.property('error').eql('No token found');
						done();
					});
            });

            it('user can not get all entry if he provide invalid token ', (done) => {
				chai.request(app)
					.get('/api/v2/entries')
					.set('Authorization', `Bearer ${invalidToken}`)
				    .end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property('name');
                    res.body.should.have.property('message');
						done();
					});
            });
            it('user can not get all entry if he does not exist', (done) => {
				chai.request(app)
					.get('/api/v2/entries')
					.set('Authorization', `Bearer ${unExistedToken}`)
				    .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('status');
					res.body.should.have.property('status').eql(401);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('Invalid Token');
					done();
						
					});
            });
            
			it('user can  get a specific entry by id ', (done) => {
				chai.request(app)
					.get((`/api/v2/entries/${propertyId}`))
					.set('Authorization', `Bearer ${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.have.property('data');
						res.body.data.should.be.a('object');
						res.body.data.should.have.property('id');
						res.body.data.should.have.property('createdon');
						res.body.data.should.have.property('ownerid');
						res.body.data.should.have.property('description').eql('edited description');
						res.body.data.should.have.property('title').eql('an edited title');
						done();
					});
			});
			it('user can not get a specific entry which he does not own ', (done) => {
				chai.request(app)
					.get((`/api/v2/entries/${propertyId}`))
					.set('Authorization', `Bearer ${token2}`)
					.end((err, res) => {
						res.body.should.have.property('data');
						res.body.data.should.be.a('object');
						res.should.have.status(403);
						res.body.data.should.have.property('error').eql('forbidden');
						res.body.should.have.property('status').eql(403);
						done();
					});
			});
			it('user can not get an  entry that does not exist ', (done) => {
				chai.request(app)
					.get('/api/v2/entries/0')
					.set('Authorization', `Bearer ${token}`)
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.have.property('data');
						res.body.data.should.be.a('object');
						res.body.data.should.have.property('error').eql('entry Not found');
						res.body.should.have.property('status').eql(404);
						done();
						
					});
			});
			it('user can not get an  entry ih he doesn not provide a token ', (done) => {
				chai.request(app)
				.get((`/api/v2/entries/${propertyId}`))
				.set('Authorization', '')
				.end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql(400);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('No token found');
					done();
						
					});
			});
			it('user can not get an  entry ih he  provide invalid token ', (done) => {
				chai.request(app)
				.get((`/api/v2/entries/${propertyId}`))
				.set('Authorization', `Bearer ${invalidToken}`)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property('name');
                    res.body.should.have.property('message');
					done();
						
					});
			});
			it('user can not get an  entry ih he does not exist in the system', (done) => {
				chai.request(app)
				.get((`/api/v2/entries/${propertyId}`))
				.set('Authorization', `Bearer ${unExistedToken}`)
				.end((err, res) => {
					res.should.have.status(401);
                    res.body.should.have.property('status');
					res.body.should.have.property('status').eql(401);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('Invalid Token');
					done();
						
					});
			});
		
			
			
			it('user can not delete an  entry if he doesn not provide a token ', (done) => {
				chai.request(app)
				.delete((`/api/v2/entries/${propertyId}`))
				.set('Authorization', '')
				.end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql(400);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('No token found');
					done();
						
					});
			});
			it('user can not delete an  entry if he  provide invalid token ', (done) => {
				chai.request(app)
				.delete((`/api/v2/entries/${propertyId}`))
				.set('Authorization', `Bearer ${invalidToken}`)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property('name');
                    res.body.should.have.property('message');
					done();
						
					});
			});
			it('user can not delete an  entry if he does not exist in the system', (done) => {
				chai.request(app)
				.delete((`/api/v2/entries/${propertyId}`))
				.set('Authorization', `Bearer ${unExistedToken}`)
				.end((err, res) => {
					res.should.have.status(401);
                    res.body.should.have.property('status');
					res.body.should.have.property('status').eql(401);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('Invalid Token');
					done();
						
					});
			});
			it('user can not update an  entry if he doesn not provide a token ', (done) => {
				chai.request(app)
				.patch((`/api/v2/entries/${propertyId}`))
				.set('Authorization', '')
				.end((err, res) => {
					res.should.have.status(400);
                    res.body.should.have.property('status');
                    res.body.should.have.property('status').eql(400);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('No token found');
					done();
						
					});
			});
			it('user can not update an  entry if he  provide invalid token ', (done) => {
				chai.request(app)
				.patch((`/api/v2/entries/${propertyId}`))
				.set('Authorization', `Bearer ${invalidToken}`)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property('name');
                    res.body.should.have.property('message');
					done();
						
					});
			});
			it('user can not update an  entry if he does not exist in the system', (done) => {
				chai.request(app)
				.patch((`/api/v2/entries/${propertyId}`))
				.set('Authorization', `Bearer ${unExistedToken}`)
				.end((err, res) => {
					res.should.have.status(401);
                    res.body.should.have.property('status');
					res.body.should.have.property('status').eql(401);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('Invalid Token');
					done();
						
					});
			});
			it('user should be able to delete his entry', (done) => {
			
				chai.request(app)
				.delete((`/api/v2/entries/${propertyId}`))
				.set('Authorization', `Bearer ${token}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('data');
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('message').eql('entry deleted successfully');
					res.body.should.have.property('status').eql(200);
					done();
					});
			});
		});
	});

	it('user should get error if he send a request with unhandled route', (done) => {
			
				chai.request(app)
					.get('/')
					
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.have.property('status').eql(404);
						res.body.should.have.property('error');
						res.body.should.have.property('error').eql('Incorrect route');
						done();
					});
			});
			
});
