import React, { useState } from 'react'
import _ from 'lodash'
import { withRouter } from "react-router"
import { connect } from 'react-redux'
import { Search, Grid } from 'semantic-ui-react'

const SearchBar = (props) => {

    const [isLoading, setIsloading] = useState(false)
    const [results, setResults] = useState([])
    const [value, setValue] = useState('')

    const handleResultSelect = (e, { result }) => props.history.push(`/removals/${result.id}`)  
    
    const handleSearchChange = (e, { value }) => {
        setIsloading(true)
        setValue(value)
    
        setTimeout(() => {

          if (value.length < 1) {
              setIsloading(false)
              setResults([])
              setValue('')
          }
    
          const re = new RegExp(_.escapeRegExp(value), 'i')
          const isMatch = (result) => re.test(result.name)

          setIsloading(false)

          const filteredResults = _.filter(props.removals, isMatch)
          const resultsForSearch = []

          filteredResults.forEach(r => {
              const matchedRemoval = {
                  title : r.name,
                  description: r.category,
                  image: r.image,
                  id: r.id,
                  price: r.value ? r.value.toString() + '€' : null
                }
                resultsForSearch.push(matchedRemoval)
          })

          setResults(resultsForSearch)
    
        }, 300)
      }

return (
      <Grid>
        <Grid.Column width={6}>
          <Search
            loading={isLoading}
            onResultSelect={handleResultSelect}
            onSearchChange={_.debounce(handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
          />
        </Grid.Column>
        {/* <Grid.Column width={10}>
          <Segment>
            <Header>State</Header>
            <pre style={{ overflowX: 'auto' }}>
              {JSON.stringify({isLoading, results, value}, null, 2)}
            </pre>
            <Header>Options</Header>
            <pre style={{ overflowX: 'auto' }}>
              {JSON.stringify(props.removals, null, 2)}
            </pre>
          </Segment>
        </Grid.Column> */}
      </Grid>
    )
}

const mapStateToProps = (state) => {
    return {
      removals: state.removals,
    }
  }



export default withRouter(connect(mapStateToProps, null)(SearchBar))