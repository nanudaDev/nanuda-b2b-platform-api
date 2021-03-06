-- 식당형 공간 신청

CREATE TABLE `FOUNDER_CONSULT` (
  `NO` int NOT NULL AUTO_INCREMENT COMMENT '방문상담 신청 번호',
  `NANUDA_USER_NO` int DEFAULT NULL COMMENT '방문 상담 신청 사용자 정보(사용자 번호 JOIN)',
  `SPACE_ID` int DEFAULT NULL COMMENT '공간 정보(공간ID JOIN)',
  `S_CONSULT_MANAGER` int DEFAULT NULL COMMENT '방문 상담 담당자(어드민 사용자 ID)',
  `STATUS` varchar(255) DEFAULT 'F_NEW_REG' COMMENT 'STATUS(NEW_REG : 신규등록, DUR_CON : 상담중, REG_COM : 등재완료, CONDUCT_COM : 실사완료, WAIT_CONTRACT : 계약대기, FIN_CONTRACT : 계약완료, NO_CONTACT : 연락불가, DROP : 드랍)',
  `CONFIRM_DATE` date DEFAULT NULL COMMENT '확정 방문 일자',
  `HOPE_DATE` date DEFAULT NULL COMMENT '희망 방문 일자 선택',
  `HOPE_TIME` varchar(10) DEFAULT NULL COMMENT '상담전화 가능한 시간 1. ALL - 상시가능, 2. 1012 - 10:00 ~ 12:00, 3. 1416 - 14:00 ~ 16:00 2. 1618 - 16:00 ~ 18:00',
  `PURPOSE_USE` varchar(5) DEFAULT 'N' COMMENT '사용목적(N: 일반)',
  `CHANGUP_EXP_YN` varchar(5) DEFAULT 'N' COMMENT '창업 경혐 유무 Y/N',
  `SPACE_OWN_YN` varchar(5) DEFAULT 'N' COMMENT '공간 소유 유무 Y/N',
  `S_CONSULT_ETC` text COMMENT '기타내용',
  `HOPE_FOOD_CATEGORY` varchar(255) DEFAULT NULL,
  `COMPANY_DECISION_STATUS` varchar(255) NOT NULL DEFAULT 'B2B_F_NEW_REG',
  `VIEW_COUNT` char(1) NOT NULL DEFAULT 'N',
  `COMPANY_USER_NO` int DEFAULT NULL COMMENT '열람한 사용자 아이디',
  `deliveredAt` datetime DEFAULT NULL COMMENT '전달 왼료 시간',
  `openedAt` timestamp NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`NO`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci