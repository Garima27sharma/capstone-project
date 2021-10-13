import { History } from 'history'
import dateFormat from 'dateformat'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'

import { issueBook, deleteBook, getBooks, patchBook } from '../api/librarys-api'
import Auth from '../auth/Auth'
import { Library } from '../types/Library'
interface LibrarysProps {
  auth: Auth
  history: History
}

interface LibrarysState {
  librarys: Library[]
  newBookName: string
  loadingBooks: boolean
  nameInput: string
  issueDateInput: string
}

export class Librarys extends React.PureComponent<LibrarysProps, LibrarysState> {
  state: LibrarysState = {
    librarys: [],
    newBookName: '',
    loadingBooks: true,
    nameInput: '',
    issueDateInput: ''
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookName: event.target.value })
  }

  onEditButtonClick = (bookId: string) => {
    this.props.history.push(`/librarys/${bookId}/edit`)
  }

  onBookCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const issueDate = this.calculateIssueDate()
      const dueDate = this.calculateDueDate() 
      const newBook = await issueBook(this.props.auth.getIdToken(), {
        name: this.state.newBookName,
        issueDate,
        dueDate
      })
      this.setState({
        librarys: [newBook, ...this.state.librarys],
        newBookName: ''
      })
    } catch {
      alert('book creation failed')
    }
  }

  onBookDelete = async (bookId: string) => {
    try {
      await deleteBook(this.props.auth.getIdToken(), bookId)
      this.setState({
        librarys: this.state.librarys.filter(library=> library.bookId != bookId)
      })
    } catch {
      alert('book deletion failed')
    }
  }

  onBookCheck = async (pos: number) => {
    try {
      const library = this.state.librarys[pos]
      await patchBook(this.props.auth.getIdToken(), library.bookId, {
        name: library.name,
        issueDate: library.issueDate,
        dueDate: library.dueDate,
        bookStatus: !library.bookStatus
      })
      this.setState({
        librarys: update(this.state.librarys, {
          [pos]: { bookStatus: { $set: !library.bookStatus } }
        })
      })
    } catch {
      alert('book deletion failed')
    }
  }

  handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: event.target.value })
  }

  handleIssueDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ issueDateInput: event.target.value })
  }

  onBookNameUpdate = async (pos: number) => {
    try {
      const library = this.state.librarys[pos]
      await patchBook(this.props.auth.getIdToken(), library.bookId, {
        name: this.state.nameInput,
        issueDate: library.issueDate,
        dueDate: library.dueDate,
        bookStatus: library.bookStatus
      })
      this.setState({
        librarys: update(this.state.librarys, {
          [pos]: { name: { $set: this.state.nameInput } }
        })
      })
    } catch {
      alert('Book deletion failed')
    }
  }

  onBookIssueDateUpdate = async (pos: number) => {
    try {
      const library = this.state.librarys[pos]
      await patchBook(this.props.auth.getIdToken(), library.bookId, {
        name: library.name,
        issueDate: this.state.issueDateInput,
        dueDate: library.dueDate,
        bookStatus: library.bookStatus
      })
      this.setState({
        librarys: update(this.state.librarys, {
          [pos]: { issueDate: { $set: this.state.issueDateInput } }
        })
      })
    } catch {
      alert('Book deletion failed')
    }
  }
  
  async componentDidMount() {
    try {
      const librarys = await getBooks(this.props.auth.getIdToken())
      this.setState({
        librarys,
        loadingBooks: false
      })
    } catch (e) {
      alert(`Failed to fetch books: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Library System</Header>

        {this.renderCreateBookInput()}

        {this.renderBooks()}
      </div>
    )
  }

  renderCreateBookInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Book',
              onClick: this.onBookCreate
            }}
            fluid
            actionPosition="left"
            placeholder="New Books"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderBooks() {
    if (this.state.loadingBooks) {
      return this.renderLoading()
    }

    return this.renderBooksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Book list loading
        </Loader>
      </Grid.Row>
    )
  }

  renderBooksList() {
    return (
      <Grid padded>
        {this.state.librarys.map((library, pos) => {
          return (
            <Grid.Row key={library.bookId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onBookCheck(pos)}
                  checked={library.bookStatus}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
               <b>{library.name}</b>
              </Grid.Column>
              <Grid.Column width={6} floated="left">
                <label><b>issueDate : </b></label>{library.issueDate}
              </Grid.Column>
              <Grid.Column width={5} floated="right">
              <label><b>dueDate : </b></label>{library.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(library.bookId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBookDelete(library.bookId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              
              <Grid.Column width={16}>
                {library.attachmentUrl && (
                  <Image src={library.attachmentUrl} size="small" wrapped />
                )}
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
  

  calculateIssueDate(): string {
    const date = new Date()
    date.setDate(date.getDate())
    return dateFormat(date, 'yyyy-mm-dd') as string
  }
  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
