import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
`;

const ListTitle = styled.h2`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &:last-child {
    border-bottom: none;
  }
`;

const BookTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
`;

const BookInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.9rem;
  color: #666;
`;

const BookInfoItem = styled.span`
  background-color: #f1f3f5;
  padding: 3px 8px;
  border-radius: 4px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #868e96;
  padding: 20px;
`;

const BookList = ({ books, type }) => {
  return (
    <ListContainer>
      <ListTitle>{type === 'scanned' ? 'Scanned Books' : 'Unscanned Books'}</ListTitle>
      {books.length === 0 ? (
        <EmptyMessage>No {type} books found.</EmptyMessage>
      ) : (
        <List>
          {books.map(book => (
            <ListItem key={book.id}>
              <BookTitle>{book.title}</BookTitle>
              <BookInfo>
                <BookInfoItem>ISBN: {book.isbn}</BookInfoItem>
                <BookInfoItem>JAN: {book.jan}</BookInfoItem>
                <BookInfoItem>Publisher: {book.publisher}</BookInfoItem>
              </BookInfo>
            </ListItem>
          ))}
        </List>
      )}
    </ListContainer>
  );
};

export default BookList;