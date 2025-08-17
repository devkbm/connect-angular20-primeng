export interface MenuGroup {
  menuGroupCode: string | null;
  menuGroupName: string | null;
  menuGroupUrl: string | null;
  description: string | null;
  sequence: number | null;
}

export interface Role {
  roleCode: string | null;
  roleName: string | null;
  description: string | null;
  menuGroupCode: string | null;
}


export interface UserToken {
  sessionId: string;
  userId: string;
  userName: string;
  companyCode: string;
  staffNo: string;
  email: string;
  imageUrl: string;
  ipAddress: string;
  roleList: Role[];
  menuGroupList: MenuGroup[];
}
