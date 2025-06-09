# bun-remote-pwsh

[![npm version](https://badge.fury.io/js/bun-remote-pwsh.svg)](https://badge.fury.io/js/bun-remote-pwsh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-orange.svg)](https://bun.sh/)

PowerShell SSH リモーティングツール - Bun/TypeScript環境からSSH経由でリモートWindowsホスト上のPowerShellスクリプトを実行

## 機能

- 🚀 **高速実行**: Bunランタイムによる高速なスクリプト実行
- 🔒 **セキュア**: SSH公開鍵認証による安全な接続
- 🌏 **多言語対応**: UTF-8、SJIS等の文字エンコーディングサポート
- 📊 **リアルタイム出力**: イベント駆動による即座の出力ストリーミング
- 🎯 **型安全**: TypeScriptによる完全な型サポート
- 🧪 **テスト済み**: 包括的な単体・統合テスト

## インストール

```bash
# npmの場合
npm install bun-remote-pwsh

# bunの場合
bun add bun-remote-pwsh

# yarnの場合
yarn add bun-remote-pwsh
```

## 使用方法

### 基本的な使用例

```typescript
import { executeRemotePowerShell } from 'bun-remote-pwsh';

// シンプルな実行
const result = await executeRemotePowerShell({
  host: '10.9.88.17',
  user: 'administrator',
  scriptPath: 'Get-Host'
});

console.log(`Exit code: ${result.returnCode}`);
console.log(`Output: ${result.stdout}`);
console.log(`Duration: ${result.finishAt - result.startAt}ms`);
```

### ファクトリー関数を使用

```typescript
import { createRemotePwsh } from 'bun-remote-pwsh';

const remotePwsh = createRemotePwsh({
  host: '10.9.88.17',
  user: 'administrator',
  scriptPath: './scripts/system-info.ps1',
  encode: 'utf8'
});

const result = await remotePwsh.invokeAsync();
```

### イベント駆動でリアルタイム出力

```typescript
import { RemotePwshSSH } from 'bun-remote-pwsh';

const remotePwsh = new RemotePwshSSH(
  '10.9.88.17',
  'administrator',
  'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10'
);

// リアルタイム出力の監視
remotePwsh.on('start', () => {
  console.log('🚀 実行開始');
});

remotePwsh.on('stdout', (data, count) => {
  console.log(`📤 出力 #${count}: ${data}`);
});

remotePwsh.on('stderr', (error) => {
  console.error(`❌ エラー: ${error}`);
});

remotePwsh.on('finish', (code) => {
  console.log(`✅ 完了 (終了コード: ${code})`);
});

const result = await remotePwsh.invokeAsync();
```

## コマンドラインツール

モジュールインストール後、コマンドラインツールも使用可能：

```bash
# 基本的な実行
bun-remote-pwsh --host 10.9.88.17 --user administrator ./script.ps1

# ヘルプ表示
bun-remote-pwsh --help

# バージョン確認
bun-remote-pwsh --version
```

## SSH設定

このツールは公開鍵認証を使用してSSH接続を行います。事前にSSH設定を完了してください：

1. **SSH公開鍵をリモートホストに配置**
2. **SSH接続が手動で可能であることを確認**
3. **PowerShell SSH リモーティングが有効になっていることを確認**

PowerShell SSH リモーティングの有効化例：
```powershell
# Windows側でSSH サーバーを有効化
Add-WindowsCapability -Online -Name OpenSSH.Server*
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

## API リファレンス

### `executeRemotePowerShell(options)`

最も簡単な実行方法。

**パラメータ:**
- `options.host` (string): リモートホスト名またはIPアドレス
- `options.user` (string): SSH接続用ユーザー名
- `options.scriptPath` (string): 実行するPowerShellスクリプト
- `options.encode?` (string): 文字エンコーディング (デフォルト: 'utf8')

**戻り値:** `Promise<RemotePwshResult>`

### `createRemotePwsh(options)`

RemotePwshSSHインスタンスを作成するファクトリー関数。

**戻り値:** `RemotePwshSSH`

### `RemotePwshSSH`

メインクラス。イベント駆動による高度な制御が可能。

**メソッド:**
- `invoke()`: 非同期実行開始（イベントベース）
- `invokeAsync()`: Promise ベースの実行
- `on(event, listener)`: イベントリスナー登録

**イベント:**
- `'start'`: 実行開始
- `'stdout'`: 標準出力受信
- `'stderr'`: エラー出力受信
- `'finish'`: 実行完了

## 開発

```bash
# 依存関係のインストール
bun install

# 開発サーバー起動
bun run dev

# テスト実行
bun test

# 統合テスト実行（SSH接続設定が必要）
bun test test/integration.test.ts

# ビルド
bun run build

# リント
bun run lint

# フォーマット
bun run format
```

### 統合テスト

SSH接続を使用した統合テストを実行するには：

1. `.env.test`ファイルを作成
2. SSH接続情報を設定
3. `ENABLE_SSH_INTEGRATION_TEST=true`に設定

```env
TEST_SSH_HOST=your.remote.host
TEST_SSH_USER=your_username
ENABLE_SSH_INTEGRATION_TEST=true
```

## 例

詳細な使用例は`examples/`ディレクトリを参照：

- `examples/basic-usage.ts` - 基本的な使用方法
- `examples/advanced-usage.ts` - 高度な使用方法とイベント処理

## ライセンス

MIT License

## 貢献

Issue報告やPull Requestを歓迎します。

## 関連項目

- [PowerShell SSH リモーティング公式ドキュメント](https://learn.microsoft.com/ja-jp/powershell/scripting/security/remoting/ssh-remoting-in-powershell)
- [Bun公式サイト](https://bun.sh/)
- [TypeScript公式サイト](https://www.typescriptlang.org/)