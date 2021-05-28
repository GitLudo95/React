describe('Blog app', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/testing/reset');
      const  user = {
        name: 'Ludo',
        username: 'Ludo',
        password: 'blablabla'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user);
      cy.visit('http://localhost:3000');
    })
    it('login form is shown', function() {
      cy.contains('Log in to application');
    })

    it('user can login', function() {
      cy.get('#LoginFormUsername').type('Ludo');
      cy.get('#LoginFormPassword').type('blablabla');
      cy.get('#LoginFormSubmit').click();

      cy.contains('Ludo logged in');
    })

    it('fails with wrong credentials', function() {
      cy.get('#LoginFormUsername').type('Ludo');
      cy.get('#LoginFormPassword').type('blablablabla');
      cy.get('#LoginFormSubmit').click();

      cy.contains('Wrong credentials were provided');
    })

    it('a blog can be created', function() {
      cy.get('#LoginFormUsername').type('Ludo');
      cy.get('#LoginFormPassword').type('blablabla');
      cy.get('#LoginFormSubmit').click();

      cy.contains('Ludo logged in');

      cy.contains('new blog').click();

      cy.get('#BlogFormTitle').type('Testing...');
      cy.get('#BlogFormAuthor').type('Test Testerson');
      cy.get('#BlogFormUrl').type('testing.nl');
      cy.get('#BlogFormSubmit').click();

      cy.contains('Succesfully created blog: Testing...');
    })

    it('a blog can be liked', function() {
      cy.get('#LoginFormUsername').type('Ludo');
      cy.get('#LoginFormPassword').type('blablabla');
      cy.get('#LoginFormSubmit').click();

      cy.contains('Ludo logged in');

      cy.contains('new blog').click();

      cy.get('#BlogFormTitle').type('Testing...');
      cy.get('#BlogFormAuthor').type('Test Testerson');
      cy.get('#BlogFormUrl').type('testing.nl');
      cy.get('#BlogFormSubmit').click();

      cy.contains('view').click();
      cy.contains('like').click();

      cy.contains('likes 1');
    })

    it('a blog can be deleted by author', function() {
      cy.get('#LoginFormUsername').type('Ludo');
      cy.get('#LoginFormPassword').type('blablabla');
      cy.get('#LoginFormSubmit').click();

      cy.contains('Ludo logged in');

      cy.contains('new blog').click();

      cy.get('#BlogFormTitle').type('Testing...');
      cy.get('#BlogFormAuthor').type('Ludo');
      cy.get('#BlogFormUrl').type('testing.nl');
      cy.get('#BlogFormSubmit').click();

      cy.contains('Succesfully created blog: Testing...');

      cy.contains('view').click();

      cy.contains('remove').click();

      cy.on('window:confirm', () => true);

      cy.contains('Succesfully removed blog Testing...');
    })

    it('a blog cannot be deleted by a different author', function() {
      cy.get('#LoginFormUsername').type('Ludo');
      cy.get('#LoginFormPassword').type('blablabla');
      cy.get('#LoginFormSubmit').click();

      cy.contains('Ludo logged in');

      cy.contains('new blog').click();

      cy.get('#BlogFormTitle').type('Testing...');
      cy.get('#BlogFormAuthor').type('Afjdlfj');
      cy.get('#BlogFormUrl').type('testing.nl');
      cy.get('#BlogFormSubmit').click();

      cy.contains('Succesfully created blog: Testing...');

      cy.contains('view').click();

      cy.contains('remove').should('not.be.visible');
    })

    it('blogs are sorted by likes', function() {
      cy.get('#LoginFormUsername').type('Ludo');
      cy.get('#LoginFormPassword').type('blablabla');
      cy.get('#LoginFormSubmit').click();

      cy.contains('Ludo logged in').then(() => {
        const token = JSON.parse(localStorage.getItem("loggedBlogappUser")).token;
        const createBlog = (blog) => {
          cy.request({
            url: "http://localhost:3003/api/blogs",
            method: "POST",
            body: blog,
            headers: {
              Authorization: `bearer ${token}`,
            },
          });
        }
  
        createBlog({
          title: "First blog",
          author: "Ludo",
          url: "testing.nl",
          likes: 34,
        });
        createBlog({
          title: "Second blog",
          author: "Ludo",
          url: "testing2.nl",
          likes: 51234,
        });
        createBlog({
            title: "Third blog",
            author: "Ludo",
            url: "testing3.nl",
            likes: 2,
        });
      });

      cy.visit('http://localhost:3000');

      cy.get('.blog').then((blogs) => {
        cy.get(blogs[0]).contains('Second blog');
        cy.get(blogs[1]).contains('First blog');
        cy.get(blogs[2]).contains('Third blog');
      })
    })
})