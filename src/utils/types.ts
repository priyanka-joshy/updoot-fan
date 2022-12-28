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
  type: 'Campaign' | 'Proposal';
  typeId: string;
  username: string;
}

export interface Proposal extends PCBase {
  sponsors: string[];
  status: 'Pending' | 'Approval' | 'Rejected' | 'Draft';
  supportingMaterials?: string[];
}

export interface ProposalSponsor {
  proposalId: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Transaction {
  amount: number;
  receiverAddress: string;
  senderAddress: string;
  status: 'Success' | 'Failed';
  timestamp: EpochTimeStamp;
  txnId: string;
  type: 'Debit' | 'Credit';
}

export interface User {
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

export interface Vote {
  _id: string;
  timestamp: EpochTimeStamp;
  txnId: string;
  type: 'Campaign' | 'Proposal';
  typeId: string;
  username: string;
}
