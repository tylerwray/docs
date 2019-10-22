import React from 'react'
import { useAmp } from 'next/amp'
import { withRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/tag'

import * as bodyLocker from '~/lib/utils/body-locker'
import Head from '~/components/layout/head'
import Layout from '~/components/layout/layout'
import Main from '~/components/layout/main'
import Heading from '~/components/text/linked-heading'
import Sidebar from '~/components/layout/sidebar'
import VersionSwitcher from '~/components/layout/version-switcher'
import Content from '~/components/layout/content'
import ContentFooter from '~/components/layout/content-footer'
import DocsNavbarDesktop from '~/components/layout/navbar/desktop'
import { GenericLink } from '~/components/text/link'
import components from '~/lib/mdx-components'
import { H1, H2, H3, H4 } from '~/components/text'
import HR from '~/components/text/hr'
import dataV1 from '~/lib/data/v1/docs'
import dataV2 from '~/lib/data/v2/docs'
import Note from '~/components/text/note'
import { FooterFeedback } from '~/components/feedback-input'

const DocH1 = ({ children }) => (
  <>
    <Heading noAnchor lean offsetTop={175}>
      <H1>{children}</H1>
    </Heading>
    <style jsx>{`
      :global(h1) {
        margin: 0;
      }
    `}</style>
  </>
)

const DocH2 = ({ children }) => (
  <>
    <Heading lean offsetTop={175}>
      <H2>{children}</H2>
    </Heading>
    <style jsx>{`
      :global(h2) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
)

const DocH3 = ({ children }) => (
  <>
    <Heading lean offsetTop={175}>
      <H3>{children}</H3>
    </Heading>
    <style jsx>{`
      :global(h3) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
)

const DocH4 = ({ children }) => (
  <>
    <Heading lean offsetTop={175}>
      <H4>{children}</H4>
    </Heading>
    <style jsx>{`
      :global(h4) {
        margin: 40px 0 0 0;
      }
    `}</style>
  </>
)

const NonAmpOnly = ({ children }) => (useAmp() ? null : children)

class withDoc extends React.Component {
  state = {
    navigationActive: false,
    version: this.props.router.asPath.split(/(v[0-9])/)[1] || 'v2'
  }

  handleVersionChange = event => {
    const href = `/docs/${event.target.value}`
    this.props.router.push(href)
    this.handleIndexClick()
  }

  handleIndexClick = () => {
    if (this.state.navigationActive) {
      bodyLocker.unlock()
      this.setState({
        navigationActive: false
      })
    }
  }

  render() {
    const {
      router,
      meta = {
        title: 'Now Documentation',
        description:
          'The knowledge base and documentation for how to use ZEIT Now and how it works.'
      }
    } = this.props
    const { navigationActive, version } = this.state
    const versionData = version === 'v2' ? dataV2 : dataV1

    return (
      <MDXProvider
        components={{
          ...components,
          h2: DocH2,
          h3: DocH3,
          h4: DocH4
        }}
      >
        <Layout dynamicSearch={false} data={versionData}>
          <Head
            titlePrefix=""
            titleSuffix=" - ZEIT Documentation"
            title={`${meta.title}`}
            description={meta.description}
            image={meta.image}
            lastEdited={meta.lastEdited}
          >
            {version !== 'v2' && <meta name="robots" content="noindex" />}
          </Head>

          <Main>
            <NonAmpOnly>
              <Sidebar active={navigationActive}>
                <DocsNavbarDesktop data={versionData} url={router} />
                <div className="select-wrapper">
                  <VersionSwitcher
                    version={version}
                    onChange={this.handleVersionChange}
                  />
                </div>
              </Sidebar>
            </NonAmpOnly>
            <Content>
              <div className="heading content-heading">
                {version === 'v1' && (
                  <Note>
                    This documentation is for <b>version 1</b> of the Now
                    platform. For the latest features, please see{' '}
                    <GenericLink href="/docs/v2">
                      the version 2 documentation
                    </GenericLink>
                    . If you have yet to upgrade, see the{' '}
                    <GenericLink href="/guides/migrate-to-zeit-now/">
                      upgrade guide
                    </GenericLink>
                    .
                  </Note>
                )}
                <DocH1>{meta.title}</DocH1>
              </div>

              <div className="content">{this.props.children}</div>

              <NonAmpOnly>
                <>
                  <HR />
                  <FooterFeedback />
                </>
              </NonAmpOnly>

              <ContentFooter
                lastEdited={meta.lastEdited}
                editUrl={meta.editUrl}
              />
            </Content>
          </Main>

          <style jsx>{`
            ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }

            .select-wrapper {
              margin-top: 64px;
            }

            .category-wrapper {
              padding: 40px 0;
            }

            .category-wrapper:not(:last-child) {
              border-bottom: 1px solid #eaeaea;
            }

            .platform-select-title {
              font-size: var(--font-size-primary);
              line-height: var(--line-height-primary);
              font-weight: 400;
              margin-bottom: 16px;
              margin-top: 32px;
            }
          `}</style>
        </Layout>
      </MDXProvider>
    )
  }
}

export default withRouter(withDoc)
