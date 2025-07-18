export const ABI = [
  {
    "type": "impl",
    "name": "StarkOverflow",
    "interface_name": "stark_overflow::StarkOverflow::IStarkOverflow"
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "stark_overflow::structs::CommonStructs::Forum",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u256"
      },
      {
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "icon_url",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "name": "total_questions",
        "type": "core::integer::u256"
      },
      {
        "name": "deleted",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "enum",
    "name": "stark_overflow::structs::CommonStructs::QuestionStatus",
    "variants": [
      {
        "name": "Open",
        "type": "()"
      },
      {
        "name": "Resolved",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "stark_overflow::structs::SerialStructs::QuestionResponse",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u256"
      },
      {
        "name": "forum_id",
        "type": "core::integer::u256"
      },
      {
        "name": "title",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "author",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "name": "repository_url",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "tags",
        "type": "core::array::Array::<core::byte_array::ByteArray>"
      },
      {
        "name": "status",
        "type": "stark_overflow::structs::CommonStructs::QuestionStatus"
      }
    ]
  },
  {
    "type": "struct",
    "name": "stark_overflow::structs::CommonStructs::Answer",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u256"
      },
      {
        "name": "author",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "question_id",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "interface",
    "name": "stark_overflow::StarkOverflow::IStarkOverflow",
    "items": [
      {
        "type": "function",
        "name": "create_forum",
        "inputs": [
          {
            "name": "name",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "icon_url",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "delete_forum",
        "inputs": [
          {
            "name": "forum_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_forum",
        "inputs": [
          {
            "name": "forum_id",
            "type": "core::integer::u256"
          },
          {
            "name": "name",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "icon_url",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_forum",
        "inputs": [
          {
            "name": "forum_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "stark_overflow::structs::CommonStructs::Forum"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_forums",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<stark_overflow::structs::CommonStructs::Forum>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "ask_question",
        "inputs": [
          {
            "name": "forum_id",
            "type": "core::integer::u256"
          },
          {
            "name": "title",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "repository_url",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "tags",
            "type": "core::array::Array::<core::byte_array::ByteArray>"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_question",
        "inputs": [
          {
            "name": "question_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "stark_overflow::structs::SerialStructs::QuestionResponse"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "stake_on_question",
        "inputs": [
          {
            "name": "question_id",
            "type": "core::integer::u256"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_total_staked_on_question",
        "inputs": [
          {
            "name": "question_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_staked_amount",
        "inputs": [
          {
            "name": "staker",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "question_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_questions",
        "inputs": [
          {
            "name": "forum_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<stark_overflow::structs::SerialStructs::QuestionResponse>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "submit_answer",
        "inputs": [
          {
            "name": "question_id",
            "type": "core::integer::u256"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_answer",
        "inputs": [
          {
            "name": "answer_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "stark_overflow::structs::CommonStructs::Answer"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_answers",
        "inputs": [
          {
            "name": "question_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<stark_overflow::structs::CommonStructs::Answer>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "mark_answer_as_correct",
        "inputs": [
          {
            "name": "question_id",
            "type": "core::integer::u256"
          },
          {
            "name": "answer_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_correct_answer",
        "inputs": [
          {
            "name": "question_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "OwnableMixinImpl",
    "interface_name": "openzeppelin_access::ownable::interface::OwnableABI"
  },
  {
    "type": "interface",
    "name": "openzeppelin_access::ownable::interface::OwnableABI",
    "items": [
      {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer_ownership",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounce_ownership",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "transferOwnership",
        "inputs": [
          {
            "name": "newOwner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounceOwnership",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "stark_token_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "stark_overflow::events::QuestionAnswered",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u256",
        "kind": "key"
      },
      {
        "name": "question_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "answer_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "date",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "stark_overflow::events::QuestionStaked",
    "kind": "struct",
    "members": [
      {
        "name": "staker",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "question_id",
        "type": "core::integer::u256",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "stark_overflow::events::ChosenAnswer",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u256",
        "kind": "key"
      },
      {
        "name": "question_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "answer_id",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "author_address",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "date",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "stark_overflow::events::ReputationAdded",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "new_total",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "stark_overflow::events::StakeStarted",
    "kind": "struct",
    "members": [
      {
        "name": "staker",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "stark_overflow::events::StakeWithdrawn",
    "kind": "struct",
    "members": [
      {
        "name": "staker",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "rewards",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        "kind": "nested"
      },
      {
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "stark_overflow::StarkOverflow::StarkOverflow::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "QuestionAnswered",
        "type": "stark_overflow::events::QuestionAnswered",
        "kind": "nested"
      },
      {
        "name": "QuestionStaked",
        "type": "stark_overflow::events::QuestionStaked",
        "kind": "nested"
      },
      {
        "name": "ChosenAnswer",
        "type": "stark_overflow::events::ChosenAnswer",
        "kind": "nested"
      },
      {
        "name": "ReputationAdded",
        "type": "stark_overflow::events::ReputationAdded",
        "kind": "nested"
      },
      {
        "name": "StakeStarted",
        "type": "stark_overflow::events::StakeStarted",
        "kind": "nested"
      },
      {
        "name": "StakeWithdrawn",
        "type": "stark_overflow::events::StakeWithdrawn",
        "kind": "nested"
      },
      {
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        "kind": "flat"
      }
    ]
  }
] as const;

export const StarkOverflowABI = ABI;
