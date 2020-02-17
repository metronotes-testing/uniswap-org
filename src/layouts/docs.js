import React from 'react'
import { Link } from 'gatsby'
import Layout from '.'
import SideBar from '../components/sidebar'
import TableofContents from '../components/toc'
import styled from 'styled-components'

import { useStaticQuery, graphql } from 'gatsby'

const StyledDocs = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  justify-content: space-between;
`

const StyledMDX = styled.div`
  /* width: 640px; */
  min-width: 550px;
  max-width: 768px;
  padding: 0;
  margin-bottom: 3rem;
  a {
    color: ${({ theme }) => theme.colors.link};
  }

  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
`

const StyledDocsNavWrapper = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style: none;
  margin: 0;
  margin-top: 2rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
`
const StyledDocsNav = styled.li`
  a {
    color: black;
  }
`

const StyledLink = styled(Link)`
  font-size: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  small {
    font-size: 0.75rem;
    opacity: 0.6;
  }
`

const Docs = props => {
  const data = useStaticQuery(graphql`
    {
      allMdx(
        filter: { fileAbsolutePath: { regex: "/docs/" } }
        sort: { order: ASC, fields: fields___slug }
      ) {
        edges {
          node {
            id
            headings {
              value
              depth
            }
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
          next {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
          previous {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Layout>
      <StyledDocs id="docs-header">
        <SideBar parent={'/docs/'} {...props} />
        <StyledMDX>
          {props.children}
          {data.allMdx.edges
            .filter(({ node }) => {
              return '/docs' + node.fields.slug === props.path
            })
            .map(({ node, next, previous }) => {
              return (
                <StyledDocsNavWrapper key={node.id}>
                  <StyledDocsNav>
                    {previous && (
                      <StyledLink
                        style={{ alignItems: 'flex-end' }}
                        to={'/docs/' + previous.fields.slug}
                        rel="prev"
                      >
                        <small>Previous</small>
                        <span>← {previous.frontmatter.title}</span>
                      </StyledLink>
                    )}
                  </StyledDocsNav>
                  <StyledDocsNav>
                    {next && (
                      <StyledLink
                        style={{ alignItems: 'flex-start' }}
                        to={'/docs/' + next.fields.slug}
                        rel="next"
                      >
                        <small>Next</small>
                        <span>{next.frontmatter.title} →</span>
                      </StyledLink>
                    )}
                  </StyledDocsNav>
                </StyledDocsNavWrapper>
              )
            })}
        </StyledMDX>
        {data.allMdx.edges
          .filter(({ node }) => {
            return '/docs' + node.fields.slug === props.path
          })
          .map(({ node }) => {
            return <TableofContents key={node.id} headings={node.headings} />
          })}
      </StyledDocs>
    </Layout>
  )
}

export default Docs