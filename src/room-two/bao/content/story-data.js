// Room 2 registries extracted without text or puzzle changes from Bảo’s authorized working tree.
export const chapters = {
  "navarre-plan": {
    "id": "navarre-plan",
    "title": "Bàn cờ Đông Dương",
    "kicker": "Chương II · Kế hoạch Nava và Đông – Xuân",
    "goal": "Cân lại kế hoạch của Nava, bắt hai giọng điện, mở nắm đấm thép và chọn nước cờ quyết định.",
    "clueIds": [
      "nava-planner",
      "nava-radio-note",
      "nava-diary",
      "nava-newspaper",
      "nava-allied-telegram",
      "nava-calendar",
      "nava-dbp-dossier"
    ],
    "puzzleIds": [
      "nava-balance",
      "nava-radio",
      "nava-fist",
      "nava-fold"
    ],
    "nextChapterId": "command-post",
    "introBeatId": "navarre-plan-intro",
    "outroBeatId": "navarre-plan-outro"
  }
};
export const clues = {
  "nava-planner": {
    "id": "nava-planner",
    "chapterId": "navarre-plan",
    "title": "Sổ kế hoạch 18 tháng",
    "body": "Kế hoạch Nava được Hội đồng Quốc phòng Pháp thông qua ngày 24/7/1953, định trong 18 tháng giành thắng lợi quân sự quyết định. Bước 1 (thu – đông 1953 và xuân 1954): phòng ngự chiến lược ở miền Bắc, tiến công chiến lược ở miền Nam. Bước 2 (từ thu – đông 1954): chuyển lực lượng ra miền Bắc, tiến công, giành thắng lợi quân sự quyết định. Lề trang: “84 tiểu đoàn cơ động toàn Đông Dương” · “40 tiểu đoàn cho mọi chiến trường còn lại”.",
    "beatId": "nava-planner-story",
    "sourceIds": [
      "nhandan-navarre-plan",
      "loigiaihay-navarre"
    ],
    "fictional": false,
    "direction": "Bàn làm việc của Nava ở gian tây bắc."
  },
  "nava-radio-note": {
    "id": "nava-radio-note",
    "chapterId": "navarre-plan",
    "title": "Ghi chú trên điện đài",
    "body": "“Hai bức điện phát cùng lúc trên một sóng, chữ người này chen vào chữ người kia. Hãy nghe từng người một.” Tai nghe trái ghi “Bộ chỉ huy Pháp”: bên đang dồn quân về một chỗ. Tai nghe phải ghi “Việt Bắc”: bên muốn kéo quân địch ra nhiều nơi.",
    "beatId": "nava-radio-note-story",
    "sourceIds": [],
    "fictional": true,
    "direction": "Điện đài ở lán tham mưu Việt Bắc, gian đông bắc."
  },
  "nava-diary": {
    "id": "nava-diary",
    "chapterId": "navarre-plan",
    "title": "Nhật ký chiến sĩ",
    "body": "Từ ngày 10/12/1953, chủ lực ta tiến công hướng Tây Bắc, giải phóng thị xã Lai Châu. Nava phải đưa thêm 6 tiểu đoàn cơ động lên tăng cường Điện Biên Phủ: nơi tập trung quân thứ hai của Pháp (nơi thứ nhất là đồng bằng Bắc Bộ).",
    "beatId": "nava-diary-story",
    "sourceIds": [
      "loigiaihay-dong-xuan"
    ],
    "fictional": false,
    "direction": "Góc nhật ký ở gian tây nam."
  },
  "nava-newspaper": {
    "id": "nava-newspaper",
    "chapterId": "navarre-plan",
    "title": "Trang báo cũ",
    "body": "Từ ngày 21/12/1953, liên quân Việt – Lào tiến công hướng Trung Lào, giải phóng Thà Khẹt, uy hiếp Xê-nô. Nava buộc phải tăng quân giữ Xê-nô.",
    "beatId": "nava-newspaper-story",
    "sourceIds": [
      "loigiaihay-dong-xuan",
      "wikipedia-dong-xuan"
    ],
    "fictional": false,
    "direction": "Giá báo cũ ở gian giữa phía nam."
  },
  "nava-allied-telegram": {
    "id": "nava-allied-telegram",
    "chapterId": "navarre-plan",
    "title": "Điện liên quân Việt – Lào",
    "body": "Cuối tháng 1/1954, liên quân Việt – Lào tiến công hướng Thượng Lào, giải phóng tỉnh Phông-xa-lì và lưu vực sông Nậm Hu. Nava phải đưa quân tăng cường cho Luông Pha-bang.",
    "beatId": "nava-allied-telegram-story",
    "sourceIds": [
      "loigiaihay-dong-xuan",
      "loigiaihay-five-places"
    ],
    "fictional": false,
    "direction": "Bàn điện báo ở gian đông nam."
  },
  "nava-calendar": {
    "id": "nava-calendar",
    "chapterId": "navarre-plan",
    "title": "Tờ lịch tháng 2/1954",
    "body": "Đầu tháng 2/1954, ta tiến công hướng Bắc Tây Nguyên, giải phóng Kon Tum, uy hiếp Plây-ku. Pháp phải tăng quân giữ Plây-ku: nơi tập trung quân thứ năm.",
    "beatId": "nava-calendar-story",
    "sourceIds": [
      "loigiaihay-dong-xuan",
      "loigiaihay-five-places"
    ],
    "fictional": false,
    "direction": "Tủ tư liệu ở gian giữa phía bắc."
  },
  "nava-dbp-dossier": {
    "id": "nava-dbp-dossier",
    "chapterId": "navarre-plan",
    "title": "Hồ sơ Điện Biên Phủ",
    "body": "Ngày 20/11/1953, Pháp nhảy dù chiếm Điện Biên Phủ. Nơi này ban đầu không nằm trong kế hoạch, rồi thành trung tâm của Kế hoạch Nava: tập đoàn cứ điểm mạnh nhất Đông Dương, 49 cứ điểm, 3 phân khu, 16.200 quân; sân bay Mường Thanh (chính) và Hồng Cúm (dự bị). Điểm yếu: nằm giữa núi rừng, xa hậu phương, mọi tiếp tế đều phải dựa vào đường không.",
    "beatId": "nava-dbp-dossier-story",
    "sourceIds": [
      "vnexpress-dien-bien",
      "loigiaihay-dong-xuan",
      "dienbien-southern-sector",
      "baolaocai-decision"
    ],
    "fictional": false,
    "direction": "Nắp hòm sắt ở phía đông hành lang."
  }
};
export const beats = {
  "navarre-plan-intro": {
    "id": "navarre-plan-intro",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [],
    "requiresRoomCompletion": false,
    "lines": [
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Cánh cửa sau lưng khép lại. Bên trái là một bàn làm việc kiểu Pháp, bên phải là lán tham mưu vách nứa. Ở giữa là sa bàn Đông Dương với một bàn tay sắt nắm chặt.",
        "sourceIds": [],
        "fictional": true
      },
      {
        "speakerId": "system",
        "portraitId": "system",
        "text": "Ngươi đã biết tên người cầm quân Pháp. Giờ hãy đọc kế hoạch của hắn. Một bên muốn nắm chặt nắm đấm, một bên muốn buộc nắm đấm ấy xòe ra.",
        "sourceIds": [],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Muốn biết ta đánh thế nào, trước hết phải hiểu địch định làm gì. Mình bắt đầu từ bàn của Nava, đọc và ghi từng dấu vết vào sổ tay trước khi động đến câu đố.",
        "sourceIds": [],
        "fictional": true
      }
    ]
  },
  "navarre-plan-outro": {
    "id": "navarre-plan-outro",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [],
    "requiresRoomCompletion": true,
    "lines": [
      {
        "speakerId": "system",
        "portraitId": "system",
        "text": "Ngày 6/12/1953, Bộ Chính trị do Chủ tịch Hồ Chí Minh chủ trì quyết định mở Chiến dịch Điện Biên Phủ. Hòm sắt đã mở, mảnh ghép thứ hai thuộc về ngươi. Phía sau cánh cửa, cả một dân tộc đang chuẩn bị.",
        "sourceIds": [
          "baolaocai-decision",
          "daibieu-decision"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Điện Biên Phủ mạnh nhất, nhưng nằm giữa núi rừng, xa hậu phương, sống nhờ máy bay. Đánh tan nơi này là đánh vào trái tim kế hoạch của Nava.",
        "sourceIds": [
          "baolaocai-decision",
          "daibieu-decision"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Sức mạnh không chỉ nằm ở đối đầu trực diện, mà còn ở việc nắm tình hình, chủ động chọn hướng đánh và buộc đối phương phải phân tán.",
        "sourceIds": [
          "baolaocai-decision",
          "daibieu-decision"
        ],
        "fictional": true
      }
    ]
  },
  "nava-planner-story": {
    "id": "nava-planner-story",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [
      "nava-planner"
    ],
    "requiresRoomCompletion": false,
    "lines": [
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Cuốn sổ trên bàn Nava có mười tám trang, mỗi trang một tháng. Trang đầu ghi: kế hoạch được Hội đồng Quốc phòng Pháp thông qua ngày 24/7/1953, hẹn trong mười tám tháng sẽ giành thắng lợi quân sự quyết định.",
        "sourceIds": [
          "nhandan-navarre-plan",
          "loigiaihay-navarre"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Kế hoạch chia làm hai bước. Bước 1, thu – đông 1953 và xuân 1954: phòng ngự chiến lược ở miền Bắc, tiến công chiến lược ở miền Nam. Bước 2, từ thu – đông 1954: chuyển lực lượng ra miền Bắc, tiến công để giành thắng lợi quyết định.",
        "sourceIds": [
          "nhandan-navarre-plan",
          "loigiaihay-navarre"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Ở lề trang có hai dòng bút chì: “84 tiểu đoàn cơ động toàn Đông Dương” và “40 tiểu đoàn cho mọi chiến trường còn lại”. Phần chênh lệch hẳn đang dồn ở đồng bằng Bắc Bộ. Không trang nào nói đến chuyện rút quân.",
        "sourceIds": [
          "nhandan-navarre-plan",
          "loigiaihay-navarre"
        ],
        "fictional": true
      }
    ]
  },
  "nava-radio-note-story": {
    "id": "nava-radio-note-story",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [
      "nava-radio-note"
    ],
    "requiresRoomCompletion": false,
    "lines": [
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Một mảnh giấy dán trên máy điện đài: “Hai bức điện phát cùng lúc trên một sóng, chữ người này chen vào chữ người kia. Hãy nghe từng người một.”",
        "sourceIds": [],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Tai nghe trái ghi “Bộ chỉ huy Pháp”, tai phải ghi “Việt Bắc”. Mình nhớ lại cuốn sổ của Nava: bên Pháp đang dồn quân về đồng bằng, còn bên Việt Bắc hẳn muốn kéo quân địch ra nhiều nơi.",
        "sourceIds": [],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Nếu hai người nói xen nhau từng chữ, mình chỉ cần nghe thật chậm từng chữ một, tách ra cho đúng người rồi ghi mỗi từ vào đúng tai nghe.",
        "sourceIds": [],
        "fictional": true
      }
    ]
  },
  "nava-diary-story": {
    "id": "nava-diary-story",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [
      "nava-diary"
    ],
    "requiresRoomCompletion": false,
    "lines": [
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Trang nhật ký đề tháng 12/1953: “Từ ngày 10, đơn vị mình tiến công hướng Tây Bắc, vào thị xã Lai Châu. Đêm nào cũng nghe máy bay địch bay về phía lòng chảo Điện Biên Phủ.”",
        "sourceIds": [
          "loigiaihay-dong-xuan"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Dòng cuối viết vội: “Nava phải đưa thêm 6 tiểu đoàn cơ động lên Điện Biên Phủ, nơi tập trung quân thứ hai.” Nơi thứ nhất là đồng bằng Bắc Bộ, vậy Tây Bắc là nước đầu tiên ta buộc Nava phải tách quân.",
        "sourceIds": [
          "loigiaihay-dong-xuan"
        ],
        "fictional": true
      }
    ]
  },
  "nava-newspaper-story": {
    "id": "nava-newspaper-story",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [
      "nava-newspaper"
    ],
    "requiresRoomCompletion": false,
    "lines": [
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Tờ báo đã ố vàng, tít lớn in: “Thà Khẹt giải phóng!”. Bài viết kể từ ngày 21/12/1953, liên quân Việt – Lào tiến công hướng Trung Lào.",
        "sourceIds": [
          "loigiaihay-dong-xuan",
          "wikipedia-dong-xuan"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Đoạn cuối cho biết địch vội tăng quân giữ Xê-nô. Lai Châu bắt đầu từ ngày 10/12, còn Trung Lào từ ngày 21/12, nên Xê-nô phải đứng sau Điện Biên Phủ trong thứ tự của mình.",
        "sourceIds": [
          "loigiaihay-dong-xuan",
          "wikipedia-dong-xuan"
        ],
        "fictional": true
      }
    ]
  },
  "nava-allied-telegram-story": {
    "id": "nava-allied-telegram-story",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [
      "nava-allied-telegram"
    ],
    "requiresRoomCompletion": false,
    "lines": [
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Bức điện liên quân Việt – Lào đề cuối tháng 1/1954: “Ta tiến công hướng Thượng Lào. Phông-xa-lì giải phóng, lưu vực sông Nậm Hu sạch bóng giặc.”",
        "sourceIds": [
          "loigiaihay-dong-xuan",
          "loigiaihay-five-places"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Địch phải co về giữ Luông Pha-bang. Cuối tháng 1/1954 đến sau Trung Lào tháng 12/1953 nhưng trước tờ lịch tháng 2, nên Luông Pha-bang đứng sau Xê-nô.",
        "sourceIds": [
          "loigiaihay-dong-xuan",
          "loigiaihay-five-places"
        ],
        "fictional": true
      }
    ]
  },
  "nava-calendar-story": {
    "id": "nava-calendar-story",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [
      "nava-calendar"
    ],
    "requiresRoomCompletion": false,
    "lines": [
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Tờ lịch tháng 2/1954 còn một dòng mực đỏ: “Ta tiến công hướng Bắc Tây Nguyên, Kon Tum giải phóng, địch phải dồn quân giữ Plây-ku.”",
        "sourceIds": [
          "loigiaihay-dong-xuan",
          "loigiaihay-five-places"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Bên lề có người ghi thêm: “nơi tập trung quân thứ năm”. Vậy Plây-ku là nước đi cuối cùng trên sa bàn, sau ba hướng tiến công khác.",
        "sourceIds": [
          "loigiaihay-dong-xuan",
          "loigiaihay-five-places"
        ],
        "fictional": true
      }
    ]
  },
  "nava-dbp-dossier-story": {
    "id": "nava-dbp-dossier-story",
    "chapterId": "navarre-plan",
    "requiredDiscoveredClueIds": [
      "nava-dbp-dossier"
    ],
    "requiresRoomCompletion": false,
    "lines": [
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Tập hồ sơ kẹp trên nắp hòm sắt ghi: ngày 20/11/1953, Pháp nhảy dù chiếm Điện Biên Phủ. Nơi này ban đầu không nằm trong kế hoạch, rồi dần thành trung tâm của Kế hoạch Nava.",
        "sourceIds": [
          "vnexpress-dien-bien",
          "loigiaihay-dong-xuan",
          "dienbien-southern-sector",
          "baolaocai-decision"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Đây là tập đoàn cứ điểm mạnh nhất Đông Dương: 49 cứ điểm, 3 phân khu, 16.200 quân, hai sân bay Mường Thanh và Hồng Cúm. Nhưng nó nằm giữa núi rừng, xa hậu phương, mọi tiếp tế đều phải dựa vào đường không.",
        "sourceIds": [
          "vnexpress-dien-bien",
          "loigiaihay-dong-xuan",
          "dienbien-southern-sector",
          "baolaocai-decision"
        ],
        "fictional": true
      },
      {
        "speakerId": "quang",
        "portraitId": "quang",
        "text": "Một nơi mạnh như thế mà phải sống nhờ máy bay. Mình ghi lại điều này trước khi gấp tấm bản đồ ở hòm sắt.",
        "sourceIds": [
          "vnexpress-dien-bien",
          "loigiaihay-dong-xuan",
          "dienbien-southern-sector",
          "baolaocai-decision"
        ],
        "fictional": true
      }
    ]
  }
};
export const puzzles = {
  "nava-balance": {
    "id": "nava-balance",
    "chapterId": "navarre-plan",
    "type": "balance",
    "title": "Cán cân 84",
    "goal": "Đọc Sổ kế hoạch trên bàn Nava, rồi cân lại 84 tiểu đoàn cơ động.",
    "instruction": "Xếp mỗi việc vào đúng bước của Kế hoạch Nava, rồi chia 84 quả cân “tiểu đoàn cơ động” cho hai đĩa theo lề Sổ kế hoạch. Cân chỉ khóa khi cả hai phần đều đúng.",
    "requiredClueIds": [
      "nava-planner"
    ],
    "totalWeights": 84,
    "cards": [
      {
        "id": "defend-north",
        "label": "Phòng ngự chiến lược ở miền Bắc"
      },
      {
        "id": "attack-south",
        "label": "Tiến công chiến lược ở miền Nam"
      },
      {
        "id": "move-north",
        "label": "Chuyển lực lượng ra miền Bắc"
      },
      {
        "id": "decisive-win",
        "label": "Giành thắng lợi quân sự quyết định"
      },
      {
        "id": "withdraw",
        "label": "Rút quân khỏi Đông Dương"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Bước 1 · thu – đông 1953, xuân 1954"
      },
      {
        "id": "step-2",
        "label": "Bước 2 · từ thu – đông 1954"
      },
      {
        "id": "none",
        "label": "Không thuộc kế hoạch"
      }
    ],
    "hints": [
      "Bước 1 bắt đầu từ thu – đông 1953, Bước 2 từ thu – đông 1954. Số quân nằm ở lề Sổ kế hoạch.",
      "Phòng ngự ở Bắc, tiến công ở Nam: Bước 1. Chuyển quân ra Bắc, giành thắng lợi quyết định: Bước 2. Rút quân không thuộc kế hoạch. Đĩa Bắc Bộ: 84 − 40 = 44."
    ],
    "messages": {
      "wrong-steps": "Có việc chưa đúng bước. Đọc lại Sổ kế hoạch: mỗi bước làm gì, vào lúc nào?",
      "wrong-weights": "Cán cân chưa khóa. Nava muốn đĩa Bắc Bộ nặng hơn tất cả phần còn lại cộng lại; lề sổ cho biết các chiến trường khác có bao nhiêu tiểu đoàn."
    },
    "successText": "Cán cân nghiêng hẳn về Bắc Bộ: 44 trên 84 tiểu đoàn cơ động. Ngăn bàn bật ra một cuộn băng điện báo. Đi tới điện đài ở lán đông bắc.",
    "answerSpec": {
      "cardSteps": {
        "defend-north": "step-1",
        "attack-south": "step-1",
        "move-north": "step-2",
        "decisive-win": "step-2",
        "withdraw": "none"
      },
      "northWeights": 44
    },
    "sourceIds": [
      "nhandan-navarre-plan",
      "loigiaihay-navarre"
    ],
    "requiresPuzzleId": null
  },
  "nava-radio": {
    "id": "nava-radio",
    "chapterId": "navarre-plan",
    "type": "interleave",
    "title": "Hai giọng trên một sóng",
    "goal": "Đến điện đài ở lán Việt Bắc và tách hai bức điện chung một sóng.",
    "instruction": "Cuộn băng chỉ có một dòng chữ, nhưng là hai bức điện phát chen nhau. Tách thành hai từ rồi ghi mỗi từ vào đúng tai nghe. Gõ có dấu hay không dấu đều được.",
    "requiredClueIds": [
      "nava-radio-note"
    ],
    "tape": "TPAHPATNRTUANNG",
    "channels": [
      {
        "id": "french",
        "label": "Bộ chỉ huy Pháp",
        "word": "TẬP TRUNG"
      },
      {
        "id": "vietbac",
        "label": "Việt Bắc",
        "word": "PHÂN TÁN"
      }
    ],
    "hints": [
      "Thử đọc cách một chữ. Nút “Tô chữ ở vị trí lẻ” đã mở để bạn dễ nhìn hơn.",
      "Chữ lẻ: T-A-P-T-R-U-N-G. Ai muốn dồn quân về một chỗ?"
    ],
    "messages": {
      "swapped-channels": "Hai từ đã đúng nhưng ngược tai nghe. Người muốn dồn quân thành nắm đấm là Nava, không phải ta.",
      "incorrect-answer": "Hai bức điện chưa tách đúng. Thử đọc cách một chữ: chữ thứ 1, 3, 5… thuộc về một người."
    },
    "successText": "Nava TẬP TRUNG, ta buộc địch PHÂN TÁN. Khay điện đài nhả ra bốn thẻ mũi tên. Mang chúng tới sa bàn giữa hành lang.",
    "telegram": {
      "text": "Bộ Chính trị, cuối tháng 9/1953: tập trung lực lượng tiến công vào những hướng quan trọng mà địch tương đối yếu, buộc địch phải phân tán lực lượng. Phương châm:",
      "words": [
        "TÍCH CỰC",
        "CHỦ ĐỘNG",
        "CƠ ĐỘNG",
        "LINH HOẠT"
      ]
    },
    "answerSpec": {
      "french": "TAPTRUNG",
      "vietbac": "PHANTAN"
    },
    "sourceIds": [
      "loigiaihay-dong-xuan",
      "baolaocai-dong-xuan",
      "nhandan-dong-xuan"
    ],
    "requiresPuzzleId": "nava-balance"
  },
  "nava-fist": {
    "id": "nava-fist",
    "chapterId": "navarre-plan",
    "type": "fist",
    "title": "Nắm đấm thép",
    "goal": "Ghi bốn mẩu tin trong phòng, rồi mở từng ngón của nắm đấm thép trên sa bàn.",
    "instruction": "Mỗi lượt, chọn một thẻ mũi tên và vùng tiến công rồi đi nước. Đúng vùng, đúng lượt thì một ngón tay sắt mở ra và một lá cờ Pháp dựng lên. Đi theo thứ tự nơi tập trung quân thứ 2 → 5; sai lượt thì Nava gom quân lại.",
    "requiredClueIds": [
      "nava-diary",
      "nava-newspaper",
      "nava-allied-telegram",
      "nava-calendar"
    ],
    "cards": [
      {
        "id": "lai-chau",
        "label": "Giải phóng thị xã Lai Châu · 12/1953",
        "short": "Lai Châu"
      },
      {
        "id": "tha-khet",
        "label": "Giải phóng Thà Khẹt · 12/1953",
        "short": "Thà Khẹt"
      },
      {
        "id": "nam-hu",
        "label": "Giải phóng Phông-xa-lì, sông Nậm Hu · cuối 1/1954",
        "short": "Nậm Hu"
      },
      {
        "id": "kon-tum",
        "label": "Giải phóng Kon Tum · đầu 2/1954",
        "short": "Kon Tum"
      }
    ],
    "regions": [
      {
        "id": "tay-bac",
        "label": "Tây Bắc"
      },
      {
        "id": "trung-lao",
        "label": "Trung Lào"
      },
      {
        "id": "thuong-lao",
        "label": "Thượng Lào"
      },
      {
        "id": "tay-nguyen",
        "label": "Bắc Tây Nguyên"
      }
    ],
    "flags": [
      {
        "id": "dbp",
        "label": "Điện Biên Phủ",
        "word": "TÍCH CỰC"
      },
      {
        "id": "seno",
        "label": "Xê-nô",
        "word": "CHỦ ĐỘNG"
      },
      {
        "id": "luang-prabang",
        "label": "Luông Pha-bang",
        "word": "CƠ ĐỘNG"
      },
      {
        "id": "pleiku",
        "label": "Plây-ku",
        "word": "LINH HOẠT"
      }
    ],
    "moveTexts": [
      "Lai Châu mất, Nava phải đưa quân lên Điện Biên Phủ. Ngón thứ nhất mở: TÍCH CỰC.",
      "Thà Khẹt giải phóng, quân Pháp kéo về giữ Xê-nô. Ngón thứ hai mở: CHỦ ĐỘNG.",
      "Nậm Hu sạch bóng giặc, địch co về Luông Pha-bang. Ngón thứ ba mở: CƠ ĐỘNG.",
      "Kon Tum giải phóng, địch dồn quân giữ Plây-ku. Ngón thứ tư mở: LINH HOẠT."
    ],
    "hints": [
      "Mẩu tin nào nói “nơi tập trung quân thứ hai”? Bắt đầu từ đó, rồi xếp các mẩu còn lại theo ngày.",
      "Lai Châu (Tây Bắc) → Thà Khẹt (Trung Lào) → Nậm Hu (Thượng Lào) → Kon Tum (Bắc Tây Nguyên)."
    ],
    "messages": {
      "wrong-turn": "Nava kịp gom quân lại. Đọc lại các mẩu tin: nơi tập trung quân thứ hai là ở đâu?",
      "wrong-region": "Mũi tên bật ra: hướng tiến công này không nằm ở vùng đó. Đọc lại mẩu tin để xem nơi được giải phóng thuộc vùng nào.",
      "incorrect-answer": "Bàn tay sắt chưa xòe hết. Đi đủ bốn nước theo đúng thứ tự."
    },
    "successText": "Bàn tay sắt xòe hẳn. Phương châm hiện đủ: tích cực, chủ động, cơ động, linh hoạt. Trong lòng bàn tay là một tấm bản đồ gấp; mang tới hòm sắt.",
    "answerSpec": {
      "moves": [
        {
          "card": "lai-chau",
          "region": "tay-bac",
          "flag": "dbp"
        },
        {
          "card": "tha-khet",
          "region": "trung-lao",
          "flag": "seno"
        },
        {
          "card": "nam-hu",
          "region": "thuong-lao",
          "flag": "luang-prabang"
        },
        {
          "card": "kon-tum",
          "region": "tay-nguyen",
          "flag": "pleiku"
        }
      ]
    },
    "telegram": {
      "text": "Bộ Chính trị, cuối tháng 9/1953: tập trung lực lượng tiến công vào những hướng quan trọng mà địch tương đối yếu, buộc địch phải phân tán lực lượng. Phương châm:",
      "words": [
        "TÍCH CỰC",
        "CHỦ ĐỘNG",
        "CƠ ĐỘNG",
        "LINH HOẠT"
      ]
    },
    "sourceIds": [
      "loigiaihay-dong-xuan",
      "nhandan-dong-xuan"
    ],
    "requiresPuzzleId": "nava-radio"
  },
  "nava-fold": {
    "id": "nava-fold",
    "chapterId": "navarre-plan",
    "type": "fold",
    "title": "Bản đồ gấp",
    "goal": "Đọc Hồ sơ Điện Biên Phủ, rồi gấp bản đồ ở hòm sắt để chọn nơi quyết chiến.",
    "instruction": "Gấp bản đồ để mép nắm đấm của Nava chạm vào nơi trận quyết chiến sẽ diễn ra. Gấp đúng chỗ, các nét chữ đứt đoạn sẽ ghép thành một dòng; ngày và tháng trên dòng ấy là mã hòm sắt.",
    "requiredClueIds": [
      "nava-dbp-dossier"
    ],
    "foldText": [
      "QUYẾT CHIẾN",
      "6 · 12 · 1953"
    ],
    "targets": [
      {
        "id": "luang-prabang",
        "label": "Luông Pha-bang",
        "text": [
          "QƯYÔTĂCĐIƠN",
          "64·810 7 3963"
        ],
        "hint": "Các nét chữ không khớp. Luông Pha-bang là nơi địch co về giữ sau khi mất lưu vực sông Nậm Hu; hồ sơ trận quyết chiến không nói về nơi này."
      },
      {
        "id": "dbp",
        "label": "Điện Biên Phủ",
        "text": [
          "QUYẾT CHIẾN",
          "6 · 12 · 1953"
        ],
        "hint": "Các nét chữ ghép khít thành một dòng. Đọc ngày và tháng trên đó để mở khóa."
      },
      {
        "id": "pleiku",
        "label": "Plây-ku",
        "text": [
          "QỔYẠTỶCỨIỠN",
          "67·21· 5 0983"
        ],
        "hint": "Các nét chữ không khớp. Plây-ku là nơi tập trung quân thứ năm sau khi Kon Tum được giải phóng, không phải tập đoàn cứ điểm sống nhờ hai sân bay."
      },
      {
        "id": "seno",
        "label": "Xê-nô",
        "text": [
          "QỲYẰTĨCỌIỮN",
          "60·519 1 8943"
        ],
        "hint": "Các nét chữ không khớp. Xê-nô là nơi địch tăng quân sau khi mất Thà Khẹt; tập đoàn cứ điểm mạnh nhất Đông Dương nằm ở nơi khác."
      }
    ],
    "hints": [
      "Đọc lại Hồ sơ Điện Biên Phủ: nơi nào mạnh nhất nhưng xa hậu phương, sống nhờ máy bay?",
      "Gấp tới Điện Biên Phủ, rồi nhập ngày và tháng hiện ra trên dòng chữ."
    ],
    "messages": {
      "wrong-target": "Chọn một lá cờ để gấp bản đồ trước khi mở khóa.",
      "wrong-code": "Ổ khóa chưa mở. Mã gồm 4 số: ngày và tháng trên dòng chữ hiện ra khi gấp đúng chỗ."
    },
    "successText": "Ngày 6/12/1953, Bộ Chính trị quyết định mở Chiến dịch Điện Biên Phủ. Hòm sắt mở: mảnh ghép thứ hai. Cửa phía đông đã mở.",
    "answerSpec": {
      "target": "dbp",
      "code": "0612"
    },
    "sourceIds": [
      "baolaocai-decision",
      "daibieu-decision"
    ],
    "requiresPuzzleId": "nava-fist"
  }
};
export const sources = {
  "nhandan-navarre-plan": {
    "id": "nhandan-navarre-plan",
    "title": "Báo Nhân Dân — Từ Điện Biên Phủ đến Geneva: Một “ngoại lệ” của lịch sử",
    "url": "https://special.nhandan.vn/mot_ngoaile_cua_lichsu/index.html"
  },
  "loigiaihay-navarre": {
    "id": "loigiaihay-navarre",
    "title": "Lời giải hay (SGK Lịch sử 12) — Âm mưu mới của Pháp - Mĩ ở Đông Dương: Kế hoạch Nava",
    "url": "https://loigiaihay.com/am-muu-moi-cua-phap-mi-o-dong-duong-ke-hoach-nava-c87a7945.html"
  },
  "loigiaihay-dong-xuan": {
    "id": "loigiaihay-dong-xuan",
    "title": "Lời giải hay (SGK Lịch sử 12) — Cuộc tiến công chiến lược Đông - Xuân 1953 - 1954 và chiến dịch Điện Biên Phủ",
    "url": "https://loigiaihay.com/cuoc-tien-cong-chien-luoc-dong-xuan-1953-1954-va-chien-dich-dien-bien-phu-nam-1954-c87a7946.html"
  },
  "wikipedia-dong-xuan": {
    "id": "wikipedia-dong-xuan",
    "title": "Wikipedia tiếng Việt — Chiến cục Đông Xuân 1953–1954",
    "url": "https://vi.wikipedia.org/wiki/Chi%E1%BA%BFn_c%E1%BB%A5c_%C4%90%C3%B4ng_Xu%C3%A2n_1953%E2%80%931954"
  },
  "loigiaihay-five-places": {
    "id": "loigiaihay-five-places",
    "title": "Lời giải hay — Trong Đông - Xuân 1953 - 1954, Pháp phải phân tán lực lượng ra những vùng nào?",
    "url": "https://loigiaihay.com/cau-hoi-110635.html"
  },
  "vnexpress-dien-bien": {
    "id": "vnexpress-dien-bien",
    "title": "VnExpress — Chiến địa Điện Biên Phủ sau 70 năm",
    "url": "https://vnexpress.net/chien-dia-dien-bien-phu-sau-70-nam-4736615.html"
  },
  "dienbien-southern-sector": {
    "id": "dienbien-southern-sector",
    "title": "Sở VHTTDL Điện Biên — Phân khu phía Nam của Tập đoàn cứ điểm Điện Biên Phủ",
    "url": "https://svhttdl.dienbien.gov.vn/portal/pages/2020-6-22/Phan-khu-phia-Nam-cua-Tap-doan-cu-diem-Dien-Bien-Pq3vk99p081mt.aspx"
  },
  "baolaocai-decision": {
    "id": "baolaocai-decision",
    "title": "Báo Lào Cai — Những quyết định cân não làm nên chiến thắng Điện Biên Phủ",
    "url": "https://baolaocai.vn/nhung-quyet-dinh-can-nao-lam-nen-chien-thang-dien-bien-phu-post382327.html"
  },
  "daibieu-decision": {
    "id": "daibieu-decision",
    "title": "Báo Đại biểu Nhân dân — Chọn Điện Biên Phủ - Quyết định lịch sử",
    "url": "https://daibieunhandan.vn/chon-dien-bien-phu-quyet-dinh-lich-su-10335081.html"
  },
  "baolaocai-dong-xuan": {
    "id": "baolaocai-dong-xuan",
    "title": "Báo Lào Cai — Chiến thắng Điện Biên Phủ: Bài học đối với sự nghiệp xây dựng nền quốc phòng toàn dân vững mạnh",
    "url": "https://baolaocai.vn/chien-thang-dien-bien-phu-bai-hoc-doi-voi-su-nghiep-xay-dung-nen-quoc-phong-toan-dan-vung-manh-post382636.html"
  },
  "nhandan-dong-xuan": {
    "id": "nhandan-dong-xuan",
    "title": "Báo Nhân Dân — Phương châm chỉ đạo chiến lược của Đảng trong Đông Xuân 1953-1954 và Chiến dịch Điện Biên Phủ",
    "url": "https://nhandan.vn/post-803638.html"
  }
};
