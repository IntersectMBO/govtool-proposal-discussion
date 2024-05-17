import type { Schema, Attribute } from '@strapi/strapi';

export interface ProposalProposalLink extends Schema.Component {
  collectionName: 'components_proposal_proposal_links';
  info: {
    displayName: 'Proposal link';
    description: '';
  };
  attributes: {
    prop_link: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    prop_link_text: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'proposal.proposal-link': ProposalProposalLink;
    }
  }
}
