import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import Blog from './Blog';

let component;
let blog;
let user;
let mockHandler;

beforeEach(() => {
    blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Ludo',
        url: 'testing.nl',
        likes: 10
      };
    
      user = {
          name: "Ludo"
      }

      mockHandler = jest.fn();
    
      component = render(
        <Blog blog={blog} user={user} />
      );
})

test('renders content', () => {
  const div = component.container.querySelector('.blog');

  const viewDiv = component.container.querySelector('.blogView');

  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  );

  expect(div).toHaveTextContent(
    'Ludo'
  );

  expect(viewDiv).toHaveStyle('display: none');
})

test('url and number of likes are shown when view is clicked', () => {
      const button = component.getByText('view');
      fireEvent.click(button);
    
      const div = component.container.querySelector('.blog');

      const viewDiv = component.container.querySelector('.blogView');

      const urlDiv = component.container.querySelector('.blogUrl');

      const likesDiv = component.container.querySelector('.blogLikes');

      expect(urlDiv).toHaveTextContent(
        'testing.nl'
      );
    
      expect(likesDiv).toHaveTextContent(
        'likes 10'
      );
})