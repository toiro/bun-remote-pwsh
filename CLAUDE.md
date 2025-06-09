# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

### 開発用コマンド
```bash
# 依存関係のインストール
bun install

# アプリケーションの実行 (スクリプトファイル指定)
bun run src/index.ts --host <ホスト名> --user <ユーザー名> <スクリプトパス>

# 単体テストの実行
bun test

# 統合テスト（SSH接続テスト）の実行
bun test test/integration.test.ts

# 特定のテストファイルの実行
bun test test/remote-pwsh.test.ts
```

### 使用例
```bash
# サンプルスクリプトの実行
bun run src/index.ts --host 10.9.88.17 --user lab ./resources/ps-scripts/sample/hostname.ps1

# PowerShellコマンド文字列の直接実行も可能
```

## アーキテクチャ概要

このプロジェクトは、Bun/TypeScript環境からSSH経由でリモートWindowsホスト上のPowerShellスクリプトを実行する**高機能リモートPowerShell実行ツール**です。

### コアアーキテクチャパターン
- **CLIレイヤー** (`src/index.ts`): コマンドライン引数解析とスクリプト実行制御（ESモジュール対応）
- **実行エンジン** (`src/remote-pwsh/remote-pwsh.ts`): 型安全なイベント駆動SSH PowerShell実行クラス
- **SSH接続管理** (`resources/ps-scripts/sshRemoteSession.ps1`): インテリジェントPowerShell SSH リモーティング
- **サンプルスクリプト** (`resources/ps-scripts/sample/`): 一般的な操作用PowerShellスクリプト集
- **統合テスト** (`test/integration.test.ts`): 実際のSSH接続を使用した包括的テストスイート

### 主要な設計原則

1. **イベント駆動実行**: Node.js EventEmitterパターンによる非同期PowerShell実行とリアルタイム出力ストリーミング

2. **多言語テキスト対応**: UTF-8をデフォルトとし、SJIS等の日本語エンコーディングにも対応（`iconv-lite`使用）

3. **インテリジェントPowerShell SSH リモーティング**: 
   - `sshRemoteSession.ps1`がスクリプトの第一パラメータを解析
   - PSSession型パラメータを自動検出し、適切な実行モードを選択
   - 従来スクリプトとPSSession対応スクリプトの両方をサポート

4. **ファイルベーススクリプト実行**: スクリプトファイルパスを受け取り、ファイル内容をリモートで実行

5. **包括的エラーハンドリングと型安全性**: 
   - 必須パラメータの厳密な検証
   - TypeScriptインターフェースによる型安全性
   - 構造化されたエラー報告と適切な終了コード

### 重要な実装詳細

- **モジュール相対パス解決**: `import.meta.url`を使用してESモジュール環境でのファイルパス解決
- **高度なPowerShell セッション管理**: 
  - スクリプト解析による自動PSSession引数注入
  - `try-finally`による確実なセッションクリーンアップ
  - PlainText出力設定による一貫した出力フォーマット
- **型安全な実行結果**: `RemotePwshResult`インターフェースによる構造化結果
- **リソース管理**: プライベートフィールドとgetterによるカプセル化、イベントリスナーの適切なクリーンアップ
- **PSModulePath環境**: PowerShellモジュール競合回避のための環境変数削除
- **文字エンコーディング**: `iconv-lite`による多言語テキスト出力の適切な処理

### テスト戦略

#### 単体テスト
- **CLI機能テスト** (`test/index.test.ts`): パラメータ検証、エラーハンドリング
- **コアクラステスト** (`test/remote-pwsh.test.ts`): RemotePwshSSHインスタンス化、設定検証

#### 統合テスト (`test/integration.test.ts`)
- **環境設定ベース**: `.env.test`ファイルによる設定管理
- **条件付き実行**: `ENABLE_SSH_INTEGRATION_TEST`による有効/無効制御
- **包括的シナリオ**:
  - 基本PowerShellコマンド実行
  - 複雑なスクリプト実行
  - エラーハンドリング検証
  - 日本語テキストエンコーディング
  - 長時間実行プロセス

### 環境設定とテスト設定

#### SSH接続設定
- **認証方式**: 公開鍵認証のみ（パスワード認証は非対応）
- **前提条件**: SSH公開鍵の事前配置、PowerShell SSH リモーティング有効化
- **設定ファイル**: `.env.test`（テスト用）、`.env.example`（設定例）

#### 開発環境
- **ランタイム**: Bun（Node.js互換、高速実行）
- **言語**: TypeScript 5+ (ESNext、厳密型チェック)
- **コード品質**: Biome（リンティング、フォーマット）
- **依存関係**: `iconv-lite`（文字エンコーディング変換）

### サンプルスクリプト例

- **hostname.ps1**: シンプルなホスト名取得
- **testPath.ps1**: パス存在確認（配列サポート）
- **findFiles.ps1**: ファイル検索（JSON出力）
- **sendFile.ps1**: PSSession対応ファイル転送

このアーキテクチャにより、プロダクション環境での安定したPowerShell SSH リモーティング、包括的なテスト、多言語対応、型安全性を実現しています。