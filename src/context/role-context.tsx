'use client';

import React, { createContext, useContext, useState } from 'react';
import { STAFF_MEMBERS } from '@/data/mock-data';
import { PositionAssignment, StaffMember } from '@/types';

// Thêm 1 tài khoản Sinh viên mẫu (Cấp 1) để kiểm thử đóng vai đủ 6 cấp độ
export const DEMO_STUDENT_PROFILE: StaffMember = {
  id: 'student-demo',
  orderNumber: 99,
  fullName: 'Nguyễn Minh Khôi (Sinh viên mẫu)',
  studentId: '2531200188',
  email: 'khoi.nguyenminh.cit25@eiu.edu.vn',
  phone: '0901234567',
  gender: 'Nam',
  dateOfBirth: '12/05/2007',
  hometown: 'Bình Dương / TP. Hồ Chí Minh',
  academicYearText: 'Sinh viên năm 2',
  majorName: 'Kỹ thuật phần mềm',
  facultyCode: 'CIT',
  cohortYear: 25,
  youthUnionTitle: 'Đoàn viên',
  bchRole: 'Không',
  isBtkMember: false,
  bktRole: 'Không',
  internalDeptRole: 'Hội viên Sinh viên',
  internalDeptCode: 'NONE',
  grassrootsRole: 'Hội viên Chi hội 25CNTT01',
  grassrootsUnitCode: '25CNTT01',
  positions: [
    {
      id: 'pos-student-1',
      unitCode: '25CNTT01',
      unitName: 'Chi hội 25CNTT01 (Khoa CNTT)',
      unitType: 'branch',
      positionTitle: 'Hội viên / Sinh viên EIU',
      divisionName: 'Khóa 2025 - Khoa Công nghệ Thông tin',
      roleInUnit: 'student',
      roleLevel: 1,
      isPrimary: true,
    },
  ],
};

// Danh sách các tài khoản tiêu biểu đại diện cho các cấp độ và mảng kiêm nhiệm
export const DEMO_PERSONAS: StaffMember[] = [
  STAFF_MEMBERS[0],  // 1. Đ/c Trương Châu Phước Lộc - Chủ tịch HSV Trường (Cấp 6)
  STAFF_MEMBERS[1],  // 2. Đ/c Nguyễn Như Quỳnh - PCT Thường trực / Tổng Thư ký VP / CHP 24QTKD01 (Cấp 6 -> 4 -> 3)
  STAFF_MEMBERS[2],  // 3. Đ/c Trần Thị Thu Huyền - PCT / Trưởng BKT / Trưởng Ban TC-XDH / CHT 25CNTT01 (Cấp 6 -> 4 -> 3)
  STAFF_MEMBERS[3],  // 4. Đ/c Nguyễn Mai Gia Tường - UV BTK / Trưởng Ban TG-PT (Phong trào) / CN CLB SV5T (Cấp 6 -> 4 -> 3)
  STAFF_MEMBERS[5],  // 5. Đ/c Đặng Trí Toàn - UV BCH / Phó BKT / Trưởng Ban TG-PT (Tuyên giáo) / CHT 25CNTT02 (Cấp 5 -> 4 -> 3)
  STAFF_MEMBERS[7],  // 6. Đ/c Nguyễn Mỹ Hạnh - UV BCH / Chánh Văn phòng / Phó Ban TC-XDH (CLB/Đội/Nhóm) (Cấp 5 -> 4)
  STAFF_MEMBERS[4],  // 7. Đ/c Phạm Thị Thanh Thủy - UV BTK / Phó Ban TC-XDH (Cụm KHSK) / CHT 25KHSK01 (Cấp 6 -> 4 -> 3)
  STAFF_MEMBERS[16], // 8. Đ/c Trần Nguyễn Quỳnh Trân - UV BKT / Phó Ban TC-XDH (Cụm CNTT) / CHP 25CNTT01 (Cấp 5 -> 4 -> 3)
  STAFF_MEMBERS[19], // 9. Đ/c Nguyễn Thanh Đạt - Phó Ban TG-PT (Phong trào) / Đội trưởng Đội CTV Xung kích (Cấp 4 -> 3)
  DEMO_STUDENT_PROFILE, // 10. Sinh viên EIU (Cấp 1)
];

interface RoleContextValue {
  currentPersona: StaffMember;
  activePosition: PositionAssignment;
  setPersonaById: (personaId: string) => void;
  setActivePositionById: (positionId: string) => void;
  allPersonas: StaffMember[];
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<StaffMember>(DEMO_PERSONAS[0]);
  const [activePosition, setActivePosition] = useState<PositionAssignment>(
    DEMO_PERSONAS[0].positions[0]
  );

  const setPersonaById = (personaId: string) => {
    const found =
      DEMO_PERSONAS.find((p) => p.id === personaId) ||
      STAFF_MEMBERS.find((p) => p.id === personaId) ||
      DEMO_PERSONAS[0];
    setCurrentPersona(found);
    setActivePosition(found.positions[0]);
  };

  const setActivePositionById = (positionId: string) => {
    const pos = currentPersona.positions.find((p) => p.id === positionId);
    if (pos) {
      setActivePosition(pos);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        currentPersona,
        activePosition,
        setPersonaById,
        setActivePositionById,
        allPersonas: DEMO_PERSONAS,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
