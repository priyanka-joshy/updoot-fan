interface PCBase {
  _id: string;
  artistId?: string[];
  author: string;
  brand?: string;
  comments?: number;
  companyId?: string;
  costPerVote: number;
  details?: string;
  encryptedSeed?: string;
  endTime?: EpochTimeStamp;
  likes?: string[];
  rewardPerComment: number;
  shares?: number;
  startTime?: EpochTimeStamp;
  target: number;
  title: string;
  titleImage?: string;
  votes?: number;
  walletAddress?: string;
}

export interface Artist {
  _id: string;
  brand: string;
  companyId: string;
  name: string;
  image: string;
}

export interface Bookmark {
  email: string;
  campaignBookmarks?: string[];
  proposalBookmarks?: string[];
}

export interface Campaign extends PCBase {
  proposalId: string;
  status: 'Draft' | 'Launched';
}

export interface Comment {
  _id: string;
  approvalId: string;
  content: string;
  isReported: boolean;
  parentCommentId?: string;
  rewardId?: string;
  timestamp: number;
  type: 'Campaign' | 'Proposal';
  typeId: string;
  username: string;
  createdAt: string;
}

export interface Like {
  type: string;
  typeid: string;
  username: string;
  timestamp: number;
}

export interface Proposal extends PCBase {
  sponsors: string[];
  status: 'Pending' | 'Approval' | 'Rejected' | 'Draft';
  supportingMaterials?: string[];
}
export type TxType = 'Comment Reward' | 'Vote' | 'Create Proposal' | 'Refund';

export interface Transaction {
  amount: number;
  receiverAddress: string;
  senderAddress: string;
  status: 'Success' | 'Failed';
  timestamp: EpochTimeStamp;
  txnId: string;
  type: TxType;
}

export interface User {
  _id: string;
  companyId?: string;
  email: string;
  encryptedSeed: string;
  managerRole?: string;
  profilePicture?: string;
  role: 'Fan' | 'Staff' | 'Manager';
  username: string;
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposalSponsor extends User {
  company: string[];
}

export interface Vote {
  _id: string;
  timestamp: EpochTimeStamp;
  txnId: string;
  type: 'Campaign' | 'Proposal';
  typeId: string;
  username: string;
}
